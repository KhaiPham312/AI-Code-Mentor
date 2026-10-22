import os
import sys
import json

# Ensure app is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.session import SessionLocal
from app.models.user import User
from app.models.classroom import Subject, Class
from app.models.exercise import Exercise, TestCase
from app.core.security import get_password_hash


def seed_database():
    db = SessionLocal()
    try:
        print("Bắt đầu khởi tạo dữ liệu mẫu (Seeding data)...")

        # 1. Seed Users
        student = db.query(User).filter(User.username == "student").first()
        if not student:
            student = User(
                username="student",
                email="student@hnue.edu.vn",
                name="Nguyễn Văn Minh (Sinh viên)",
                student_id="725105001",
                class_group="K72 CNTT A",
                role="student",
                password_hash=get_password_hash("123456"),
                is_active=True,
            )
            db.add(student)
            print(" -> Đã tạo tài khoản sinh viên: student / 123456")

        teacher = db.query(User).filter(User.username == "teacher").first()
        if not teacher:
            teacher = User(
                username="teacher",
                email="teacher@hnue.edu.vn",
                name="TS. Phạm Văn Mười (Giảng viên)",
                class_group="Khoa Công nghệ Thông tin",
                role="teacher",
                password_hash=get_password_hash("123456"),
                is_active=True,
            )
            db.add(teacher)
            print(" -> Đã tạo tài khoản giảng viên: teacher / 123456")

        db.commit()

        # 2. Seed Subject and Class
        subject = db.query(Subject).filter(Subject.name == "Cấu trúc dữ liệu & Giải thuật").first()
        if not subject:
            subject = Subject(
                name="Cấu trúc dữ liệu & Giải thuật",
                code="CS201",
                description="Học phần cơ sở ngành về các thuật toán và cấu trúc dữ liệu cốt lõi",
                teacher_id=teacher.id,
            )
            db.add(subject)
            db.commit()
            db.refresh(subject)
            print(" -> Đã tạo môn học: Cấu trúc dữ liệu & Giải thuật")

        classroom = db.query(Class).filter(Class.class_code == "K72-CNTT-A").first()
        if not classroom:
            classroom = Class(
                name="Lớp K72 CNTT A - Học kỳ 1",
                subject_id=subject.id,
                teacher_id=teacher.id,
                class_code="K72-CNTT-A",
                semester="2026-2027.1",
            )
            db.add(classroom)
            db.commit()
            print(" -> Đã tạo lớp học: K72-CNTT-A")

        # 3. Seed Exercises
        ex1 = db.query(Exercise).filter(Exercise.id == 1).first()
        if not ex1:
            ex1 = Exercise(
                id=1,
                subject_id=subject.id,
                title="Bài 01: Tìm số nguyên tố trong mảng",
                difficulty="easy",
                category="Mảng & Số học",
                language="python",
                time_limit_ms=1000,
                memory_limit_mb=128,
                description="Cho một danh sách các số nguyên arr. Hãy viết chương trình tìm và in ra danh sách mới chứa tất cả các số nguyên tố có trong arr, giữ nguyên thứ tự xuất hiện ban đầu.",
                input_format="Mảng số nguyên arr (ví dụ: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11])",
                output_format="Danh sách các số nguyên tố tìm được (ví dụ: [2, 3, 5, 7, 11])",
                constraints=json.dumps(["0 <= len(arr) <= 10^4", "-10^5 <= arr[i] <= 10^5"]),
                boilerplate_code="""import json
import sys

def is_prime(n: int) -> bool:
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

def find_primes(arr: list[int]) -> list[int]:
    primes = []
    for num in arr:
        if is_prime(num):
            primes.append(num)
    return primes

if __name__ == '__main__':
    data = sys.stdin.read().strip()
    if data:
        arr = json.loads(data)
        res = find_primes(arr)
        print(json.dumps(res))
""",
                is_published=True,
            )
            db.add(ex1)
            db.commit()
            db.refresh(ex1)

            # Add test cases for Ex 1
            tc1_1 = TestCase(
                exercise_id=ex1.id,
                input_data="[2, 3, 4, 5, 6, 7, 8, 9, 10, 11]",
                expected_output="[2, 3, 5, 7, 11]",
                explanation="Các số nguyên tố gồm 2, 3, 5, 7, 11.",
                is_hidden=False,
                order_index=1,
            )
            tc1_2 = TestCase(
                exercise_id=ex1.id,
                input_data="[4, 6, 8, 9, 10]",
                expected_output="[]",
                explanation="Không có số nguyên tố nào trong mảng.",
                is_hidden=False,
                order_index=2,
            )
            tc1_hidden1 = TestCase(
                exercise_id=ex1.id,
                input_data="[-5, 0, 1, 2, 13]",
                expected_output="[2, 13]",
                explanation="Test ẩn kiểm tra số âm, 0 và 1.",
                is_hidden=True,
                order_index=3,
            )
            tc1_hidden2 = TestCase(
                exercise_id=ex1.id,
                input_data="[97, 101, 103]",
                expected_output="[97, 101, 103]",
                explanation="Test ẩn các số nguyên tố lớn hơn.",
                is_hidden=True,
                order_index=4,
            )
            db.add_all([tc1_1, tc1_2, tc1_hidden1, tc1_hidden2])
            db.commit()
            print(" -> Đã tạo Bài tập 1 và test cases (sample & hidden)")

        # Exercise 2: Chuỗi ngoặc hợp lệ
        ex2 = db.query(Exercise).filter(Exercise.id == 2).first()
        if not ex2:
            ex2 = Exercise(
                id=2,
                subject_id=subject.id,
                title="Bài 02: Kiểm tra tính hợp lệ của chuỗi ngoặc",
                difficulty="medium",
                category="Cấu trúc dữ liệu Stack",
                language="python",
                time_limit_ms=1000,
                memory_limit_mb=128,
                description="Cho một chuỗi ký tự s chỉ bao gồm các ký tự mở và đóng ngoặc '()[]{}'. Hãy xác định xem chuỗi đầu vào có hợp lệ hay không.",
                input_format="Chuỗi ký tự s",
                output_format="True hoặc False",
                constraints=json.dumps(["1 <= len(s) <= 10^4", "Chuỗi s chỉ bao gồm ()[]{}"]),
                boilerplate_code="""import sys

def is_valid_parentheses(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    return len(stack) == 0

if __name__ == '__main__':
    s = sys.stdin.read().strip()
    # Strip quotes if passed as JSON string
    if s.startswith('"') and s.endswith('"'):
        s = s[1:-1]
    print(is_valid_parentheses(s))
""",
                is_published=True,
            )
            db.add(ex2)
            db.commit()
            db.refresh(ex2)

            tc2_1 = TestCase(
                exercise_id=ex2.id,
                input_data="()[]{}",
                expected_output="True",
                explanation="Các cặp ngoặc liên tiếp hợp lệ.",
                is_hidden=False,
                order_index=1,
            )
            tc2_2 = TestCase(
                exercise_id=ex2.id,
                input_data="([)]",
                expected_output="False",
                explanation="Ngoặc lồng sai thứ tự đóng mở.",
                is_hidden=False,
                order_index=2,
            )
            tc2_hidden = TestCase(
                exercise_id=ex2.id,
                input_data="{[]}",
                expected_output="True",
                explanation="Ngoặc lồng nhau đúng quy tắc.",
                is_hidden=True,
                order_index=3,
            )
            db.add_all([tc2_1, tc2_2, tc2_hidden])
            db.commit()
            print(" -> Đã tạo Bài tập 2 và test cases")

        print("✅ Hoàn tất khởi tạo dữ liệu mẫu thành công!")
    except Exception as e:
        db.rollback()
        print(f"❌ Lỗi khi seed dữ liệu: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
