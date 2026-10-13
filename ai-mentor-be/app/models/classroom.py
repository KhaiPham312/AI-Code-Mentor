from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    code = Column(String(30), nullable=True)
    description = Column(Text, nullable=True)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    classes = relationship("Class", back_populates="subject")
    exercises = relationship("Exercise", back_populates="subject")


class Class(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    class_code = Column(String(20), unique=True, nullable=False, index=True)
    semester = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    subject = relationship("Subject", back_populates="classes")
    teacher = relationship("User", back_populates="teaching_classes")
    enrollments = relationship("ClassEnrollment", back_populates="classroom", cascade="all, delete-orphan")


class ClassEnrollment(Base):
    __tablename__ = "class_enrollments"

    class_id = Column(Integer, ForeignKey("classes.id"), primary_key=True)
    student_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    enrolled_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    classroom = relationship("Class", back_populates="enrollments")
    student = relationship("User", back_populates="enrollments")
