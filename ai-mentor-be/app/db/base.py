# Import all models here so that Alembic and Base.metadata can discover them
from app.db.session import Base
from app.models.user import User
from app.models.classroom import Subject, Class, ClassEnrollment
from app.models.exercise import Exercise, TestCase
from app.models.submission import Submission
from app.models.chat import ChatHistory

__all__ = [
    "Base",
    "User",
    "Subject",
    "Class",
    "ClassEnrollment",
    "Exercise",
    "TestCase",
    "Submission",
    "ChatHistory",
]
