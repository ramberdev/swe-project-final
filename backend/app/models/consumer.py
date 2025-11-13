from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.models.base import Base

class ConsumerType(str, enum.Enum):
    RESTAURANT = "Restaurant"
    HOTEL = "Hotel"
    OTHER = "Other"

class Consumer(Base):
    __tablename__ = "consumers"

    ConsumerID = Column(Integer, primary_key=True, index=True)
    CompanyName = Column(String(255), nullable=False)
    Address = Column(String(500))
    Phone = Column(String(50))
    Email = Column(String(255))
    Type = Column(Enum(ConsumerType), default=ConsumerType.RESTAURANT)
    CreatedAt = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    staff = relationship("ConsumerStaff", back_populates="consumer", cascade="all, delete-orphan")
    links = relationship("Link", back_populates="consumer", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="consumer", cascade="all, delete-orphan")

