from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.chat import ChatHistory
from app.models.user import User
from app.schemas.chat import ChatMessageCreate, ChatMessageResponse
from app.services.ai_service import AIService
from app.api.deps import get_current_active_user

router = APIRouter()


@router.post("/chat", response_model=ChatMessageResponse)
async def chat_with_ai_mentor(
    msg_in: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    # 1. Save user question
    user_record = ChatHistory(
        user_id=current_user.id,
        exercise_id=msg_in.exercise_id,
        role="user",
        intent=msg_in.intent or "free_chat",
        content=msg_in.content,
    )
    db.add(user_record)
    db.commit()

    # 2. Generate Socratic AI response
    mentor_reply = await AIService.generate_mentor_reply(
        prompt=msg_in.content,
        code_context=msg_in.current_code,
        terminal_error=msg_in.terminal_error,
        intent=msg_in.intent,
    )

    # 3. Save assistant reply
    ai_record = ChatHistory(
        user_id=current_user.id,
        exercise_id=msg_in.exercise_id,
        role="assistant",
        intent=msg_in.intent or "free_chat",
        content=mentor_reply,
    )
    db.add(ai_record)
    db.commit()
    db.refresh(ai_record)

    return ai_record


@router.get("/history", response_model=List[ChatMessageResponse])
def get_chat_history(
    exercise_id: Optional[int] = Query(None, description="Lọc hội thoại theo bài tập"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    query = db.query(ChatHistory).filter(ChatHistory.user_id == current_user.id)
    if exercise_id:
        query = query.filter(ChatHistory.exercise_id == exercise_id)

    messages = query.order_by(ChatHistory.created_at.asc()).all()
    return messages
