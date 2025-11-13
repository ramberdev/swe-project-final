from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.models.base import Base

class ConsumerStaffRole(str, enum.Enum):
    OWNER = "Owner"
    MANAGER = "Manager"
    STAFF = "Staff"

class ConsumerStaff(Base):
    __tablename__ = "consumer_staff"

    StaffID = Column(Integer, primary_key=True, index=True)
    UserID = Column(Integer, ForeignKey("users.UserID"), nullable=False)
    ConsumerID = Column(Integer, ForeignKey("consumers.ConsumerID"), nullable=False)
    Role = Column(Enum(ConsumerStaffRole), nullable=False)
    JoinedAt = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="consumer_staff")
    consumer = relationship("Consumer", back_populates="staff")
    orders = relationship("Order", back_populates="consumer_staff")
    complaints = relationship("Complaint", back_populates="consumer_staff")

