from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.base import get_db
from app.models.chat import Chat, Message
from app.models.link import Link, LinkStatus
from app.schemas.chat import ChatResponse, MessageCreate, MessageResponse
from typing import List

router = APIRouter()

@router.get("/link/{link_id}", response_model=ChatResponse)
async def get_or_create_chat(link_id: int, db: Session = Depends(get_db)):
    """Get or create chat for a link"""
    # Verify link exists and is approved
    link = db.query(Link).filter(Link.LinkID == link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    
    if link.Status != LinkStatus.APPROVED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Link must be approved to access chat"
        )
    
    # Get or create chat
    chat = db.query(Chat).filter(Chat.LinkID == link_id).first()
    if not chat:
        chat = Chat(LinkID=link_id)
        db.add(chat)
        db.commit()
        db.refresh(chat)
    
    return chat

@router.post("/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def create_message(message: MessageCreate, user_id: int, db: Session = Depends(get_db)):
    """Send a message in a chat"""
    db_message = Message(
        ChatID=message.chat_id,
        UserID=user_id,
        Content=message.content,
        MessageType=message.message_type,
        FileURL=message.file_url,
        ProductLinkID=message.product_link_id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@router.get("/{chat_id}/messages", response_model=List[MessageResponse])
async def get_messages(chat_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get messages for a chat"""
    messages = db.query(Message).filter(Message.ChatID == chat_id).offset(skip).limit(limit).all()
    return messages

