from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ChatMessageCreate(BaseModel):
    exercise_id: Optional[int] = None
    role: str = "user"  # 'user' | 'assistant'
    content: str
    intent: Optional[str] = "free_chat"
    current_code: Optional[str] = None
    terminal_error: Optional[str] = None


class ChatMessageResponse(BaseModel):
    id: int
    exercise_id: Optional[int] = None
    role: str  # 'user' | 'assistant'
    content: str
    intent: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
