from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.core.security import verify_password, get_password_hash, create_access_token
from app.api.deps import get_current_active_user

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if username or email already exists
    existing = db.query(User).filter(
        or_(User.username == user_in.username, User.email == user_in.email)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tên đăng nhập hoặc email đã tồn tại."
        )

    db_user = User(
        username=user_in.username,
        email=user_in.email,
        name=user_in.name,
        role=user_in.role,
        student_id=user_in.student_id,
        class_group=user_in.class_group,
        avatar=user_in.avatar,
        password_hash=get_password_hash(user_in.password),
        is_active=True,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        or_(
            User.username == login_data.username_or_email,
            User.email == login_data.username_or_email
        )
    ).first()

    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tài khoản hoặc mật khẩu không chính xác.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tài khoản đã bị vô hiệu hóa."
        )

    access_token = create_access_token(subject=user.id)
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_active_user)
):
    return current_user


# ==========================================
# RESET PASSWORD & FORGOT PASSWORD FLOW
# ==========================================

from typing import Optional, Dict
import secrets
from datetime import datetime, timedelta, timezone
from urllib.parse import quote_plus
from pydantic import BaseModel, EmailStr
from fastapi import Request
from app.services.email import send_reset_password_email
from app.core.config import settings

# In-memory storage for reset tokens: token -> {"email": str, "expires_at": datetime}
_reset_tokens: Dict[str, dict] = {}


class ForgotPasswordRequest(BaseModel):
    account_or_email: str


class ForgotPasswordResponse(BaseModel):
    message: str
    email: str
    reset_link: Optional[str] = None


class ResetPasswordRequest(BaseModel):
    email: str
    token: str
    new_password: str


class ResetPasswordResponse(BaseModel):
    message: str


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(
    payload: ForgotPasswordRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    identifier = payload.account_or_email.strip().lower()
    if not identifier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vui lòng cung cấp email hoặc tên đăng nhập."
        )

    # 1. Tìm tài khoản trong cơ sở dữ liệu
    user = db.query(User).filter(
        or_(
            User.email.ilike(identifier),
            User.username.ilike(identifier)
        )
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy tài khoản với email hoặc tên đăng nhập này!"
        )

    # 2. Sinh mã token đặt lại mật khẩu ngẫu nhiên an toàn
    token_suffix = secrets.token_hex(16)
    token_prefix = secrets.token_hex(3)
    reset_token = f"{token_prefix}o-{token_suffix}"

    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.RESET_TOKEN_EXPIRE_MINUTES)
    _reset_tokens[reset_token] = {
        "email": user.email.lower(),
        "expires_at": expires_at,
    }

    # 3. Xác định Frontend Base URL (ưu tiên origin/referer từ request của FE)
    origin_header = request.headers.get("origin")
    referer_header = request.headers.get("referer")
    frontend_base = settings.FRONTEND_URL

    if origin_header:
        frontend_base = origin_header.rstrip("/")
    elif referer_header:
        # e.g. http://localhost:3000/
        try:
            from urllib.parse import urlparse
            parsed = urlparse(referer_header)
            frontend_base = f"{parsed.scheme}://{parsed.netloc}"
        except Exception:
            pass

    reset_link = f"{frontend_base}/auth/reset-password?email={quote_plus(user.email)}&token={reset_token}"

    # 4. Gửi email HTML tới hộp thư Gmail của người dùng
    send_reset_password_email(
        email_to=user.email,
        user_name=user.name,
        reset_link=reset_link,
    )

    return ForgotPasswordResponse(
        message=f"Liên kết đặt lại mật khẩu đã được gửi tới email {user.email}! Vui lòng mở hộp thư Gmail của bạn và nhấn vào nút 'Đặt lại mật khẩu' trong thư.",
        email=user.email,
        reset_link=reset_link if settings.DEBUG else None
    )


@router.post("/reset-password", response_model=ResetPasswordResponse)
def reset_password(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    email = payload.email.strip().lower()
    token = payload.token.strip()
    new_password = payload.new_password

    if not email or not token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Liên kết đặt lại mật khẩu không hợp lệ hoặc thiếu thông tin."
        )

    if len(new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mật khẩu mới phải có tối thiểu 6 ký tự."
        )

    # 1. Kiểm tra tính hợp lệ và thời hạn của token
    token_data = _reset_tokens.get(token)
    now = datetime.now(timezone.utc)

    # Chấp nhận token nếu tồn tại trong bộ nhớ và còn hạn
    is_valid_token = False
    if token_data:
        if token_data["expires_at"] > now and token_data["email"] == email:
            is_valid_token = True
    elif settings.DEBUG and len(token) >= 8:
        # Chế độ debug/fallback cho phép token kiểm thử hợp lệ
        is_valid_token = True

    if not is_valid_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn."
        )

    # 2. Tìm người dùng trong DB
    user = db.query(User).filter(User.email.ilike(email)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy tài khoản người dùng."
        )

    # 3. Cập nhật mật khẩu mới (hash chuẩn bcrypt)
    user.password_hash = get_password_hash(new_password)
    db.commit()

    # 4. Hủy token đã dùng để tránh tấn công Replay
    if token in _reset_tokens:
        del _reset_tokens[token]

    return ResetPasswordResponse(
        message="Mật khẩu của bạn đã được cập nhật thành công! Vui lòng đăng nhập bằng mật khẩu mới."
    )

