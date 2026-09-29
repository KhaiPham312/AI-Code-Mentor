from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base
import os

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False) # 'student', 'teacher', 'admin'

class Subject(Base):
    __tablename__ = 'subjects'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    teacher_id = Column(Integer, ForeignKey('users.id'))

class Class(Base):
    __tablename__ = 'classes'
    id = Column(Integer, primary_key=True, autoincrement=True)
    subject_id = Column(Integer, ForeignKey('subjects.id'))
    teacher_id = Column(Integer, ForeignKey('users.id'))
    class_code = Column(String(20), unique=True, nullable=False)
    semester = Column(String(20))

class ClassEnrollment(Base):
    __tablename__ = 'class_enrollments'
    class_id = Column(Integer, ForeignKey('classes.id'), primary_key=True)
    student_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    enrolled_at = Column(DateTime, default=datetime.utcnow)

class Exercise(Base):
    __tablename__ = 'exercises'
    id = Column(Integer, primary_key=True, autoincrement=True)
    subject_id = Column(Integer, ForeignKey('subjects.id'))
    title = Column(String(200), nullable=False)
    description = Column(Text)
    difficulty = Column(String(20))
    boilerplate_code = Column(Text)

class TestCase(Base):
    __tablename__ = 'test_cases'
    id = Column(Integer, primary_key=True, autoincrement=True)
    exercise_id = Column(Integer, ForeignKey('exercises.id'))
    input_data = Column(Text)
    expected_output = Column(Text)
    is_hidden = Column(Boolean, default=True)

class Submission(Base):
    __tablename__ = 'submissions'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    exercise_id = Column(Integer, ForeignKey('exercises.id'))
    source_code = Column(Text)
    status = Column(String(20))
    submitted_at = Column(DateTime, default=datetime.utcnow)

class ChatHistory(Base):
    __tablename__ = 'chat_history'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    exercise_id = Column(Integer, ForeignKey('exercises.id'))
    role = Column(String(10)) # 'user' or 'ai'
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


# ... (giữ nguyên các phần import và class định nghĩa bảng ở trên) ...

# Lấy đường dẫn tuyệt đối của thư mục đang chứa file define_table.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Nối chuỗi để trỏ file ai_mentor.db vào đúng thư mục đó
db_path = os.path.join(BASE_DIR, 'ai_mentor.db')

# Khởi tạo DB với đường dẫn tuyệt đối
engine = create_engine(f'sqlite:///{db_path}', echo=True)
Base.metadata.create_all(engine)