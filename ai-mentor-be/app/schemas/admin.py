from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr


class UserAdminResponse(BaseModel):
    id: int
    username: str
    email: str
    name: str
    role: str
    student_id: Optional[str] = None
    class_group: Optional[str] = None
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserRoleUpdate(BaseModel):
    role: str  # 'student', 'teacher', 'admin'


class UserStatusUpdate(BaseModel):
    is_active: bool


class UserPasswordReset(BaseModel):
    new_password: str = "123456"


class UserCreateByAdmin(BaseModel):
    username: str
    email: EmailStr
    name: str
    role: str = "student"
    password: str = "123456"
    student_id: Optional[str] = None
    class_group: Optional[str] = None


class SecurityIncidentResponse(BaseModel):
    id: int
    user_id: int
    username: str
    user_name: str
    exercise_id: int
    exercise_title: str
    language: str
    source_code: str
    error_message: str
    submitted_at: datetime


class SystemAIConfig(BaseModel):
    provider: str = "google_gemini"  # 'google_gemini', 'local_ollama', 'mock'
    model_name: str = "gemini-2.5-flash"
    temperature: float = 0.4
    max_tokens: int = 1000
    daily_quota_per_student: int = 30
    rate_limit_per_minute: int = 5
    system_prompt: str
    api_key_configured: bool = True


class SystemAIConfigUpdate(BaseModel):
    provider: Optional[str] = None
    model_name: Optional[str] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    daily_quota_per_student: Optional[int] = None
    rate_limit_per_minute: Optional[int] = None
    system_prompt: Optional[str] = None


class PlatformAnalyticsResponse(BaseModel):
    total_users: int
    total_students: int
    total_teachers: int
    total_admins: int
    total_exercises: int
    total_submissions: int
    passed_submissions: int
    overall_pass_rate: float
    security_incidents_count: int
    daily_activity: List[Dict[str, Any]]
    top_languages: List[Dict[str, Any]]
