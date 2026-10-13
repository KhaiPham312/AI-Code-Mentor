import sys
import time
import subprocess
import tempfile
import os
from typing import Tuple, List, Dict, Any
from app.core.config import settings


class CodeRunner:
    @staticmethod
    def execute_python(code: str, input_data: str, timeout_seconds: float = 3.0) -> Tuple[str, str, int, bool]:
        """
        Executes python code in an isolated subprocess with timeout and input passing.
        Returns: (output, error_message, execution_time_ms, is_success)
        """
        start_time = time.perf_counter()
        with tempfile.NamedTemporaryFile(suffix=".py", mode="w", delete=False) as f:
            f.write(code)
            temp_path = f.name

        try:
            process = subprocess.run(
                [sys.executable, temp_path],
                input=input_data,
                text=True,
                capture_output=True,
                timeout=timeout_seconds,
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
        finally:
            if os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except OSError:
                    pass

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

        for tc in test_cases:
            # Execute
            out, err, time_ms, ok = cls.execute_python(
                code=code,
                input_data=tc.input_data,
                timeout_seconds=timeout_sec
            )
            total_time_ms += time_ms

            clean_out = out.strip()
            clean_expected = tc.expected_output.strip()
            passed = ok and (clean_out == clean_expected)

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
