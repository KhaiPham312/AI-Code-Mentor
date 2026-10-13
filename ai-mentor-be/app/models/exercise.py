from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True)
    title = Column(String(200), nullable=False, index=True)
    difficulty = Column(String(20), default="easy")  # 'easy', 'medium', 'hard'
    category = Column(String(100), default="Mảng & Cơ bản")
    language = Column(String(20), default="python")  # 'python', 'cpp', 'java'
    time_limit_ms = Column(Integer, default=1000)
    memory_limit_mb = Column(Integer, default=128)
    description = Column(Text, nullable=False)
    input_format = Column(Text, nullable=True)
    output_format = Column(Text, nullable=True)
    constraints = Column(Text, nullable=True)  # JSON-encoded array or bullet points
    boilerplate_code = Column(Text, nullable=True)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    subject = relationship("Subject", back_populates="exercises")
    test_cases = relationship("TestCase", back_populates="exercise", cascade="all, delete-orphan", order_by="TestCase.order_index")
    submissions = relationship("Submission", back_populates="exercise", cascade="all, delete-orphan")
    chat_messages = relationship("ChatHistory", back_populates="exercise", cascade="all, delete-orphan")


class TestCase(Base):
    __tablename__ = "test_cases"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    input_data = Column(Text, nullable=False)
    expected_output = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    is_hidden = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)

    # Relationships
    exercise = relationship("Exercise", back_populates="test_cases")
