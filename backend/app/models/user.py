from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.models.base import Base

class UserRole(str, enum.Enum):
    ADMIN = "Admin"
    REGULAR = "Regular"

class User(Base):
    __tablename__ = "users"

    UserID = Column(Integer, primary_key=True, index=True)
    Name = Column(String(255), nullable=False)
    Email = Column(String(255), unique=True, nullable=False, index=True)
    Password = Column(String(255), nullable=False)  # Should be hashed
    Phone = Column(String(50))
    Role = Column(Enum(UserRole), default=UserRole.REGULAR)
    CreatedAt = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    supplier_staff = relationship("SupplierStaff", back_populates="user", cascade="all, delete-orphan")
    consumer_staff = relationship("ConsumerStaff", back_populates="user", cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="user")
    complaint_logs = relationship("ComplaintLog", back_populates="user")

