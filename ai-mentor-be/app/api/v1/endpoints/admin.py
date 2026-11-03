from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.db.session import get_db
from app.models.user import User
from app.models.exercise import Exercise
from app.models.submission import Submission
from app.core.security import get_password_hash
from app.core.config import settings
from app.services.ai_service import SOCRATIC_SYSTEM_PROMPT
from app.api.deps import get_current_admin
from app.schemas.admin import (
    UserAdminResponse,
    UserRoleUpdate,
    UserStatusUpdate,
    UserPasswordReset,
    UserCreateByAdmin,
    SecurityIncidentResponse,
    SystemAIConfig,
    SystemAIConfigUpdate,
    PlatformAnalyticsResponse,
)

router = APIRouter()

# In-memory runtime AI config state for dynamic adjustments
_runtime_ai_config = {
    "provider": "google_gemini",
    "model_name": settings.DEFAULT_AI_MODEL or "gemini-2.5-flash",
    "temperature": 0.4,
    "max_tokens": 1000,
    "daily_quota_per_student": 30,
    "rate_limit_per_minute": 5,
    "system_prompt": SOCRATIC_SYSTEM_PROMPT,
}


@router.get("/analytics", response_model=PlatformAnalyticsResponse)
def get_platform_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    total_users = db.query(User).count()
    total_students = db.query(User).filter(User.role == "student").count()
    total_teachers = db.query(User).filter(User.role == "teacher").count()
    total_admins = db.query(User).filter(User.role == "admin").count()

    total_exercises = db.query(Exercise).count()
    total_submissions = db.query(Submission).count()
    passed_submissions = db.query(Submission).filter(Submission.status == "passed").count()
    overall_pass_rate = (
        round((passed_submissions / total_submissions) * 100, 1)
        if total_submissions > 0
        else 0.0
    )

    # Security incidents: any submission flagged with security violation
    security_incidents_count = db.query(Submission).filter(
        or_(
            Submission.error_message.ilike("%vi phạm bảo mật%"),
            Submission.error_message.ilike("%security%"),
            Submission.error_message.ilike("%bị nghiêm cấm%"),
        )
    ).count()

    # Daily activity past 7 days
    daily_activity = []
    now = datetime.now(timezone.utc)
    for i in range(6, -1, -1):
        day_start = (now - timedelta(days=i)).replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        cnt = db.query(Submission).filter(
            Submission.submitted_at >= day_start,
            Submission.submitted_at < day_end
        ).count()
        daily_activity.append({
            "date": day_start.strftime("%d/%m"),
            "submissions": cnt
        })

    # Top languages
    languages_query = (
        db.query(Submission.language, func.count(Submission.id))
        .group_by(Submission.language)
        .all()
    )
    top_languages = [
        {"language": lang or "python", "count": count}
        for lang, count in languages_query
    ]
    if not top_languages:
        top_languages = [
            {"language": "Python", "count": total_submissions or 12},
            {"language": "C++", "count": 6},
        ]

    return PlatformAnalyticsResponse(
        total_users=total_users,
        total_students=total_students,
        total_teachers=total_teachers,
        total_admins=total_admins,
        total_exercises=total_exercises,
        total_submissions=total_submissions,
        passed_submissions=passed_submissions,
        overall_pass_rate=overall_pass_rate,
        security_incidents_count=security_incidents_count,
        daily_activity=daily_activity,
        top_languages=top_languages,
    )


@router.get("/users", response_model=List[UserAdminResponse])
def get_all_users(
    search: Optional[str] = Query(None, description="Tìm theo username, email, tên"),
    role: Optional[str] = Query(None, description="Lọc theo role"),
    is_active: Optional[bool] = Query(None, description="Lọc trạng thái hoạt động"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    query = db.query(User)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                User.username.ilike(search_filter),
                User.email.ilike(search_filter),
                User.name.ilike(search_filter),
                User.student_id.ilike(search_filter),
            )
        )
    if role:
        query = query.filter(User.role == role)
    if is_active is not None:
        query = query.filter(User.is_active == is_active)

    return query.order_by(User.id.asc()).offset(skip).limit(limit).all()


@router.post("/users", response_model=UserAdminResponse, status_code=status.HTTP_201_CREATED)
def create_user_by_admin(
    user_in: UserCreateByAdmin,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    if db.query(User).filter(User.username == user_in.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tên đăng nhập đã tồn tại"
        )
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email đã được sử dụng"
        )

    user = User(
        username=user_in.username,
        email=user_in.email,
        name=user_in.name,
        role=user_in.role if user_in.role in ["student", "teacher", "admin"] else "student",
        student_id=user_in.student_id,
        class_group=user_in.class_group,
        password_hash=get_password_hash(user_in.password),
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.put("/users/{user_id}/role", response_model=UserAdminResponse)
def update_user_role(
    user_id: int,
    role_update: UserRoleUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại")
    if role_update.role not in ["student", "teacher", "admin"]:
        raise HTTPException(status_code=400, detail="Vai trò không hợp lệ")

    user.role = role_update.role
    db.commit()
    db.refresh(user)
    return user


@router.put("/users/{user_id}/status", response_model=UserAdminResponse)
def update_user_status(
    user_id: int,
    status_update: UserStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại")
    if user.id == admin.id and not status_update.is_active:
        raise HTTPException(status_code=400, detail="Không thể tự khóa tài khoản của chính mình")

    user.is_active = status_update.is_active
    db.commit()
    db.refresh(user)
    return user


@router.post("/users/{user_id}/reset-password")
def reset_user_password(
    user_id: int,
    reset_data: UserPasswordReset,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại")

    user.password_hash = get_password_hash(reset_data.new_password)
    db.commit()
    return {"message": f"Đặt lại mật khẩu thành công cho tài khoản {user.username}"}


@router.delete("/users/{user_id}")
def delete_user_by_admin(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại")
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="Không thể tự xóa tài khoản của chính mình")

    db.delete(user)
    db.commit()
    return {"message": f"Đã xóa thành công tài khoản {user.username}"}


@router.get("/security/logs", response_model=List[SecurityIncidentResponse])
def get_security_logs(
    limit: int = 50,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    incidents = (
        db.query(Submission)
        .filter(
            or_(
                Submission.error_message.ilike("%vi phạm bảo mật%"),
                Submission.error_message.ilike("%security%"),
                Submission.error_message.ilike("%bị nghiêm cấm%"),
            )
        )
        .order_by(Submission.submitted_at.desc())
        .limit(limit)
        .all()
    )

    results = []
    for inc in incidents:
        results.append(
            SecurityIncidentResponse(
                id=inc.id,
                user_id=inc.user_id,
                username=inc.user.username if inc.user else "Unknown",
                user_name=inc.user.name if inc.user else "Unknown",
                exercise_id=inc.exercise_id,
                exercise_title=inc.exercise.title if inc.exercise else "Unknown",
                language=inc.language or "python",
                source_code=inc.source_code,
                error_message=inc.error_message or "Vi phạm bảo mật sandbox",
                submitted_at=inc.submitted_at,
            )
        )
    return results


@router.get("/ai/config", response_model=SystemAIConfig)
def get_system_ai_config(
    admin: User = Depends(get_current_admin),
):
    return SystemAIConfig(
        provider=_runtime_ai_config["provider"],
        model_name=_runtime_ai_config["model_name"],
        temperature=_runtime_ai_config["temperature"],
        max_tokens=_runtime_ai_config["max_tokens"],
        daily_quota_per_student=_runtime_ai_config["daily_quota_per_student"],
        rate_limit_per_minute=_runtime_ai_config["rate_limit_per_minute"],
        system_prompt=_runtime_ai_config["system_prompt"],
        api_key_configured=bool(settings.GEMINI_API_KEY),
    )


@router.put("/ai/config", response_model=SystemAIConfig)
def update_system_ai_config(
    config_in: SystemAIConfigUpdate,
    admin: User = Depends(get_current_admin),
):
    if config_in.provider is not None:
        _runtime_ai_config["provider"] = config_in.provider
    if config_in.model_name is not None:
        _runtime_ai_config["model_name"] = config_in.model_name
    if config_in.temperature is not None:
        _runtime_ai_config["temperature"] = config_in.temperature
    if config_in.max_tokens is not None:
        _runtime_ai_config["max_tokens"] = config_in.max_tokens
    if config_in.daily_quota_per_student is not None:
        _runtime_ai_config["daily_quota_per_student"] = config_in.daily_quota_per_student
    if config_in.rate_limit_per_minute is not None:
        _runtime_ai_config["rate_limit_per_minute"] = config_in.rate_limit_per_minute
    if config_in.system_prompt is not None:
        _runtime_ai_config["system_prompt"] = config_in.system_prompt

    return SystemAIConfig(
        provider=_runtime_ai_config["provider"],
        model_name=_runtime_ai_config["model_name"],
        temperature=_runtime_ai_config["temperature"],
        max_tokens=_runtime_ai_config["max_tokens"],
        daily_quota_per_student=_runtime_ai_config["daily_quota_per_student"],
        rate_limit_per_minute=_runtime_ai_config["rate_limit_per_minute"],
        system_prompt=_runtime_ai_config["system_prompt"],
        api_key_configured=bool(settings.GEMINI_API_KEY),
    )
