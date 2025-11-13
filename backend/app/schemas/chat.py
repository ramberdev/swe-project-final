from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MessageCreate(BaseModel):
    chat_id: int
    content: Optional[str] = None
    message_type: str = "text"
    file_url: Optional[str] = None
    product_link_id: Optional[int] = None

class MessageResponse(BaseModel):
    MessageID: int
    ChatID: int
    UserID: int
    Content: Optional[str] = None
    SentAt: datetime
    IsRead: bool
    MessageType: str
    FileURL: Optional[str] = None
    ProductLinkID: Optional[int] = None

    class Config:
        from_attributes = True

class ChatResponse(BaseModel):
    ChatID: int
    LinkID: int
    CreatedAt: datetime
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True

