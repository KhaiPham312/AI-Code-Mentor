import sys
import time
import subprocess
import tempfile
import os
import re
import ast
import json
import sqlite3
import resource
from typing import Tuple, List, Dict, Any, Optional
from app.core.config import settings


class SecuritySanitizer:
    """
    Bộ kiểm tra và làm sạch mã nguồn (Pre-execution Security Validator).
    Ngăn chặn tuyệt đối các hành vi truy cập filesystem, đánh cắp biến môi trường,
    mở kết nối mạng hoặc tấn công Denial of Service / Remote Code Execution.
    """

    BANNED_PYTHON_MODULES = {
        "os", "subprocess", "shutil", "socket", "urllib", "requests", "http",
        "builtins", "posix", "resource", "ctypes", "inspect", "pickle", "shelve",
        "marshal", "importlib", "glob", "pathlib", "webbrowser", "signal",
        "pty", "threading", "multiprocessing", "concurrent", "tempfile",
        "ftplib", "poplib", "imaplib", "smtplib", "telnetlib"
    }

    BANNED_PYTHON_FUNCS = {
        "eval", "exec", "open", "compile", "__import__", "getattr", "setattr",
        "delattr", "globals", "locals", "vars"
    }

    BANNED_PYTHON_ATTRS = {
        "__class__", "__bases__", "__subclasses__", "__mro__", "__globals__",
        "__code__", "__dict__", "__builtins__"
    }

    BANNED_CPP_HEADERS = [
        r'#\s*include\s*<fstream>',
        r'#\s*include\s*<filesystem>',
        r'#\s*include\s*<sys/',
        r'#\s*include\s*<unistd\.h>',
        r'#\s*include\s*<windows\.h>',
        r'#\s*include\s*<dlfcn\.h>',
        r'#\s*include\s*<arpa/',
        r'#\s*include\s*<netinet/',
        r'#\s*include\s*<netdb\.h>',
        r'#\s*include\s*<dirent\.h>',
        r'#\s*include\s*<signal\.h>',
        r'#\s*include\s*<pthread\.h>',
    ]

    BANNED_CPP_SYMBOLS = [
        r'\bsystem\s*\(',
        r'\bpopen\s*\(',
        r'\bfork\s*\(',
        r'\bvfork\s*\(',
        r'\bexec[vlp]',
        r'\bsocket\s*\(',
        r'\bconnect\s*\(',
        r'\bbind\s*\(',
        r'\blisten\s*\(',
        r'\bkill\s*\(',
        r'\bfopen\s*\(',
        r'\bfreopen\s*\(',
        r'\bstd::ifstream\b',
        r'\bifstream\b',
        r'\bstd::ofstream\b',
        r'\bofstream\b',
        r'\bremove\s*\(',
        r'\brename\s*\(',
        r'\basm\s*\(',
        r'\b__asm__\b',
    ]

    BANNED_SQL_PATTERNS = [
        r'\bATTACH\b',
        r'\bDETACH\b',
        r'\bPRAGMA\b',
        r'\bLOAD_EXTENSION\b',
        r'\bVACUUM\b',
        r'\bREINDEX\b',
    ]

    @classmethod
    def validate_python(cls, code: str) -> Optional[str]:
        try:
            tree = ast.parse(code)
        except SyntaxError:
            # Lỗi cú pháp sẽ được trình thông dịch Python báo chi tiết
            return None

        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    root = alias.name.split('.')[0]
                    if root in cls.BANNED_PYTHON_MODULES:
                        return f"Vi phạm bảo mật: Module '{alias.name}' bị nghiêm cấm trong Sandbox."
            elif isinstance(node, ast.ImportFrom):
                if node.module:
                    root = node.module.split('.')[0]
                    if root in cls.BANNED_PYTHON_MODULES:
                        return f"Vi phạm bảo mật: Import từ module '{node.module}' bị nghiêm cấm trong Sandbox."
            elif isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name) and node.func.id in cls.BANNED_PYTHON_FUNCS:
                    return f"Vi phạm bảo mật: Hàm '{node.func.id}' bị hạn chế vì lý do an toàn."
            elif isinstance(node, ast.Attribute):
                if node.attr in cls.BANNED_PYTHON_ATTRS:
                    return f"Vi phạm bảo mật: Thuộc tính nhạy cảm '{node.attr}' bị cấm truy cập."

        return None

    @classmethod
    def validate_cpp(cls, code: str) -> Optional[str]:
        for pattern in cls.BANNED_CPP_HEADERS:
            if re.search(pattern, code, re.IGNORECASE):
                return f"Vi phạm bảo mật: Thư viện/Header '{pattern}' bị cấm trong C++ Sandbox."

        for pattern in cls.BANNED_CPP_SYMBOLS:
            if re.search(pattern, code):
                return f"Vi phạm bảo mật: Lời gọi hệ thống/I-O '{pattern}' bị cấm trong C++ Sandbox."

        return None

    @classmethod
    def validate_sql(cls, code: str) -> Optional[str]:
        for pattern in cls.BANNED_SQL_PATTERNS:
            if re.search(pattern, code, re.IGNORECASE):
                return f"Vi phạm bảo mật: Câu lệnh/từ khóa '{pattern}' bị cấm trong SQL Sandbox."

        return None

    @classmethod
    def validate(cls, code: str, language: str) -> Optional[str]:
        lang = (language or "python").lower()
        if "python" in lang or lang == "py":
            return cls.validate_python(code)
        elif "cpp" in lang or "c++" in lang or lang == "c":
            return cls.validate_cpp(code)
        elif "sql" in lang:
            return cls.validate_sql(code)
        return None


class CodeRunner:
    @staticmethod
    def _get_safe_env() -> Dict[str, str]:
        """Tạo môi trường vô trùng, hoàn toàn KHÔNG kế thừa secret keys hay database URL của server"""
        return {
            "PATH": "/usr/local/bin:/usr/bin:/bin",
            "HOME": "/tmp",
            "PYTHONUNBUFFERED": "1",
            "LC_ALL": "C.UTF-8",
            "LANG": "C.UTF-8",
        }

    @staticmethod
    def _create_resource_limiter(timeout_seconds: float, memory_mb: int = 256):
        """Thiết lập giới hạn tài nguyên hệ điều hành qua Linux setrlimit (chống fork bomb, OOM, ăn đĩa)"""
        def limit_resources():
            try:
                # Giới hạn thời gian CPU (timeout + buffer 1s)
                cpu_limit = max(1, int(timeout_seconds) + 1)
                resource.setrlimit(resource.RLIMIT_CPU, (cpu_limit, cpu_limit + 1))

                # Giới hạn bộ nhớ RAM ảo (Address Space)
                mem_bytes = memory_mb * 1024 * 1024
                resource.setrlimit(resource.RLIMIT_AS, (mem_bytes, mem_bytes))

                # Giới hạn dung lượng file ghi ra đĩa (tối đa 1MB)
                resource.setrlimit(resource.RLIMIT_FSIZE, (1024 * 1024, 1024 * 1024))

                # Giới hạn số process/thread con tối đa (chống fork bomb)
                resource.setrlimit(resource.RLIMIT_NPROC, (30, 30))
            except Exception:
                pass

        return limit_resources

    @classmethod
    def execute_python(cls, code: str, input_data: str, timeout_seconds: float = 3.0) -> Tuple[str, str, int, bool]:
        """Thực thi Python code trong sandbox an toàn với giới hạn tài nguyên và phân tích AST"""
        # 1. Pre-execution static security audit
        sec_err = SecuritySanitizer.validate_python(code)
        if sec_err:
            return "", sec_err, 0, False

        start_time = time.perf_counter()
        with tempfile.TemporaryDirectory() as tmpdir:
            temp_path = os.path.join(tmpdir, "solution.py")
            with open(temp_path, "w", encoding="utf-8") as f:
                f.write(code)

            try:
                process = subprocess.run(
                    [sys.executable, "-I", temp_path],
                    input=input_data,
                    text=True,
                    capture_output=True,
                    timeout=timeout_seconds,
                    cwd=tmpdir,
                    env=cls._get_safe_env(),
                    preexec_fn=cls._create_resource_limiter(timeout_seconds, memory_mb=256),
                )
                elapsed_ms = int((time.perf_counter() - start_time) * 1000)
                stdout = process.stdout[: settings.MAX_OUTPUT_LENGTH_CHARS]
                stderr = process.stderr[: settings.MAX_OUTPUT_LENGTH_CHARS]

                if process.returncode != 0:
                    return stdout, stderr or f"Process exited with code {process.returncode}", elapsed_ms, False
                return stdout, "", elapsed_ms, True

            except subprocess.TimeoutExpired:
                elapsed_ms = int((time.perf_counter() - start_time) * 1000)
                return "", f"Time Limit Exceeded ({int(timeout_seconds * 1000)}ms)", elapsed_ms, False
            except Exception as e:
                elapsed_ms = int((time.perf_counter() - start_time) * 1000)
                return "", str(e), elapsed_ms, False

    @classmethod
    def execute_cpp(cls, code: str, input_data: str, timeout_seconds: float = 3.0) -> Tuple[str, str, int, bool]:
        """Biên dịch và thực thi C++ (g++ -O2 -std=c++17) trong sandbox cô lập"""
        # 1. Pre-execution static security audit
        sec_err = SecuritySanitizer.validate_cpp(code)
        if sec_err:
            return "", sec_err, 0, False

        start_time = time.perf_counter()
        with tempfile.TemporaryDirectory() as tmpdir:
            src_path = os.path.join(tmpdir, "solution.cpp")
            bin_path = os.path.join(tmpdir, "solution.out")
            with open(src_path, "w", encoding="utf-8") as f:
                f.write(code)

            # 2. Compile step
            try:
                compile_proc = subprocess.run(
                    ["g++", "-O2", "-std=c++17", "-fno-asm", "-Wall", src_path, "-o", bin_path],
                    capture_output=True,
                    text=True,
                    timeout=6.0,
                    cwd=tmpdir,
                    env=cls._get_safe_env(),
                )
                if compile_proc.returncode != 0:
                    err = compile_proc.stderr[: settings.MAX_OUTPUT_LENGTH_CHARS]
                    return "", f"Lỗi biên dịch (Compilation Error):\n{err}", 0, False
            except subprocess.TimeoutExpired:
                return "", "Lỗi biên dịch: Thời gian biên dịch vượt quá giới hạn (6000ms)", 0, False
            except Exception as e:
                return "", f"Lỗi trình biên dịch: {str(e)}", 0, False

            # 3. Execution step
            try:
                process = subprocess.run(
                    [bin_path],
                    input=input_data,
                    text=True,
                    capture_output=True,
                    timeout=timeout_seconds,
                    cwd=tmpdir,
                    env=cls._get_safe_env(),
                    preexec_fn=cls._create_resource_limiter(timeout_seconds, memory_mb=256),
                )
                elapsed_ms = int((time.perf_counter() - start_time) * 1000)
                stdout = process.stdout[: settings.MAX_OUTPUT_LENGTH_CHARS]
                stderr = process.stderr[: settings.MAX_OUTPUT_LENGTH_CHARS]

                if process.returncode != 0:
                    return stdout, stderr or f"Process exited with code {process.returncode}", elapsed_ms, False
                return stdout, "", elapsed_ms, True

            except subprocess.TimeoutExpired:
                elapsed_ms = int((time.perf_counter() - start_time) * 1000)
                return "", f"Time Limit Exceeded ({int(timeout_seconds * 1000)}ms)", elapsed_ms, False
            except Exception as e:
                elapsed_ms = int((time.perf_counter() - start_time) * 1000)
                return "", str(e), elapsed_ms, False

    @classmethod
    def execute_sql(cls, code: str, input_data: str, timeout_seconds: float = 3.0) -> Tuple[str, str, int, bool]:
        """Thực thi SQL an toàn trong SQLite In-Memory độc lập (:memory:), cô lập hoàn toàn khỏi DB hệ thống"""
        # 1. Pre-execution static security audit
        sec_err = SecuritySanitizer.validate_sql(code)
        if sec_err:
            return "", sec_err, 0, False

        start_time = time.perf_counter()

        # Tạo database độc lập thuần túy trong RAM
        try:
            conn = sqlite3.connect(":memory:")
            conn.enable_load_extension(False)
            cursor = conn.cursor()

            # Giới hạn số instruction chống vòng lặp đệ quy vô tận trong SQL (CTE)
            ops_count = [0]
            max_ops = 500000

            def progress_handler():
                ops_count[0] += 1000
                if ops_count[0] > max_ops:
                    return 1  # Ngắt query
                return 0

            conn.set_progress_handler(progress_handler, 1000)

            # Nạp dữ liệu mẫu/DDL nếu input_data chứa schema SQL
            if input_data and ("CREATE TABLE" in input_data.upper() or "INSERT INTO" in input_data.upper()):
                cursor.executescript(input_data)

            # Thực thi câu lệnh của sinh viên
            cursor.execute(code)

            if cursor.description:
                # Query trả về dữ liệu (SELECT)
                rows = cursor.fetchall()
                lines = []
                for row in rows:
                    lines.append(" | ".join(str(val) for val in row))
                stdout = "\n".join(lines)
            else:
                conn.commit()
                stdout = f"Query executed successfully. Rows affected: {cursor.rowcount}"

            conn.close()
            elapsed_ms = int((time.perf_counter() - start_time) * 1000)
            return stdout, "", elapsed_ms, True

        except sqlite3.OperationalError as e:
            elapsed_ms = int((time.perf_counter() - start_time) * 1000)
            return "", f"SQL Operational Error: {str(e)}", elapsed_ms, False
        except Exception as e:
            elapsed_ms = int((time.perf_counter() - start_time) * 1000)
            return "", f"SQL Execution Error: {str(e)}", elapsed_ms, False

    @classmethod
    def execute(cls, code: str, input_data: str, language: str = "python", timeout_seconds: float = 3.0) -> Tuple[str, str, int, bool]:
        """Điều phối bộ thực thi phù hợp dựa vào ngôn ngữ"""
        lang = (language or "python").lower().strip()
        if "cpp" in lang or "c++" in lang or lang == "c":
            return cls.execute_cpp(code, input_data, timeout_seconds)
        elif "sql" in lang:
            return cls.execute_sql(code, input_data, timeout_seconds)
        else:
            return cls.execute_python(code, input_data, timeout_seconds)

    @classmethod
    def run_tests(
        cls,
        code: str,
        test_cases: List[Any],
        language: str = "python",
        timeout_ms: int = 2000,
        is_sample_only: bool = True
    ) -> Dict[str, Any]:
        results = []
        passed_count = 0
        total_time_ms = 0
        timeout_sec = max(0.5, timeout_ms / 1000.0)

        # Kiểm tra trước bảo mật toàn bộ code trước khi chạy
        sec_err = SecuritySanitizer.validate(code, language)
        if sec_err:
            for tc in test_cases:
                results.append({
                    "test_case_id": tc.id,
                    "input": tc.input_data if not tc.is_hidden or is_sample_only else "[Hidden Test]",
                    "expected_output": tc.expected_output if not tc.is_hidden or is_sample_only else "[Hidden Test]",
                    "actual_output": "[Chặn Bảo Mật]",
                    "passed": False,
                    "execution_time_ms": 0,
                    "error_message": sec_err,
                })
            return {
                "status": "error",
                "passed_tests": 0,
                "total_tests": len(test_cases),
                "execution_time_ms": 0,
                "results": results,
            }

        for tc in test_cases:
            out, err, time_ms, ok = cls.execute(
                code=code,
                input_data=tc.input_data or "",
                language=language,
                timeout_seconds=timeout_sec
            )
            total_time_ms += time_ms

            clean_out = out.strip()
            clean_expected = (tc.expected_output or "").strip()

            # So sánh linh hoạt kết quả cho cả format thường, format bảng SQL và JSON
            passed = ok and (
                clean_out == clean_expected or
                clean_out.replace(" ", "") == clean_expected.replace(" ", "") or
                clean_out.lower() == clean_expected.lower()
            )

            if passed:
                passed_count += 1

            # Mask hidden test case actual/expected data if it's not a sample test
            results.append({
                "test_case_id": tc.id,
                "input": tc.input_data if not tc.is_hidden or is_sample_only else "[Hidden Test]",
                "expected_output": tc.expected_output if not tc.is_hidden or is_sample_only else "[Hidden Test]",
                "actual_output": clean_out if not tc.is_hidden or is_sample_only else ("[Output Hidden]" if passed else "[Mismatch]"),
                "passed": passed,
                "execution_time_ms": time_ms,
                "error_message": err if (not tc.is_hidden or is_sample_only) else ("Error occurred" if err else None),
            })

        total_tests = len(test_cases)
        overall_status = "passed" if (total_tests > 0 and passed_count == total_tests) else ("failed" if total_tests > 0 else "idle")
        if any(r["error_message"] and "Time Limit Exceeded" in str(r["error_message"]) for r in results):
            overall_status = "error"

        return {
            "status": overall_status,
            "passed_tests": passed_count,
            "total_tests": total_tests,
            "execution_time_ms": total_time_ms,
            "results": results
        }
