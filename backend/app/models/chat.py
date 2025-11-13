from sqlalchemy import Column, Integer, ForeignKey, DateTime, Boolean, Text, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base

class Chat(Base):
    __tablename__ = "chats"

    ChatID = Column(Integer, primary_key=True, index=True)
    LinkID = Column(Integer, ForeignKey("links.LinkID"), nullable=False, unique=True)
    CreatedAt = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    link = relationship("Link", back_populates="chat")
    messages = relationship("Message", back_populates="chat", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"

    MessageID = Column(Integer, primary_key=True, index=True)
    ChatID = Column(Integer, ForeignKey("chats.ChatID"), nullable=False)
    UserID = Column(Integer, ForeignKey("users.UserID"), nullable=False)
    Content = Column(Text)
    SentAt = Column(DateTime(timezone=True), server_default=func.now())
    IsRead = Column(Boolean, default=False)
    MessageType = Column(String(50), default="text")  # text, file, audio
    FileURL = Column(String(500))  # For file attachments
    ProductLinkID = Column(Integer, nullable=True)  # Reference to product if message contains product link

    # Relationships
    chat = relationship("Chat", back_populates="messages")
    user = relationship("User", back_populates="messages")

