from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    student_id = Column(String(30), nullable=True)
    class_group = Column(String(100), nullable=True)
    avatar = Column(String(255), nullable=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="student")  # 'student', 'teacher', 'admin'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    submissions = relationship("Submission", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("ChatHistory", back_populates="user", cascade="all, delete-orphan")
    enrollments = relationship("ClassEnrollment", back_populates="student", cascade="all, delete-orphan")
    teaching_classes = relationship("Class", back_populates="teacher")
