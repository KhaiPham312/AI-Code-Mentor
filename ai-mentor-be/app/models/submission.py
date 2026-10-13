from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    source_code = Column(Text, nullable=False)
    language = Column(String(20), default="python")
    status = Column(String(20), default="pending")  # 'pending', 'running', 'passed', 'failed', 'error'
    passed_tests = Column(Integer, default=0)
    total_tests = Column(Integer, default=0)
    execution_time_ms = Column(Integer, default=0)
    stdout = Column(Text, nullable=True)
    error_message = Column(Text, nullable=True)
    results_detail = Column(Text, nullable=True)  # JSON-encoded array of test results
    submitted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="submissions")
    exercise = relationship("Exercise", back_populates="submissions")
