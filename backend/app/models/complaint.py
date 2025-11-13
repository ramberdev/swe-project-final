from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.models.base import Base

class ComplaintStatus(str, enum.Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"
    ESCALATED = "Escalated"

class ComplaintPriority(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class Complaint(Base):
    __tablename__ = "complaints"

    ComplaintID = Column(Integer, primary_key=True, index=True)
    OrderID = Column(Integer, ForeignKey("orders.OrderID"), nullable=False)
    ConsumerStaffID = Column(Integer, ForeignKey("consumer_staff.StaffID"), nullable=False)
    SupplierStaffID = Column(Integer, ForeignKey("supplier_staff.StaffID"), nullable=True)  # Assigned resolver
    Title = Column(String(255), nullable=False)
    Description = Column(Text, nullable=False)
    Status = Column(Enum(ComplaintStatus), default=ComplaintStatus.OPEN)
    Priority = Column(Enum(ComplaintPriority), default=ComplaintPriority.MEDIUM)
    CreatedAt = Column(DateTime(timezone=True), server_default=func.now())
    ResolvedAt = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    order = relationship("Order", back_populates="complaints")
    consumer_staff = relationship("ConsumerStaff", back_populates="complaints")
    supplier_staff = relationship("SupplierStaff", back_populates="complaints")
    logs = relationship("ComplaintLog", back_populates="complaint", cascade="all, delete-orphan")

class ComplaintLog(Base):
    __tablename__ = "complaint_logs"

    LogID = Column(Integer, primary_key=True, index=True)
    ComplaintID = Column(Integer, ForeignKey("complaints.ComplaintID"), nullable=False)
    UserID = Column(Integer, ForeignKey("users.UserID"), nullable=False)
    Action = Column(String(255), nullable=False)  # e.g., "Created", "Escalated", "Resolved"
    Notes = Column(Text)
    Timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    complaint = relationship("Complaint", back_populates="logs")
    user = relationship("User", back_populates="complaint_logs")

