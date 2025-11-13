from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.models.base import Base

class LinkStatus(str, enum.Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"
    REMOVED = "Removed"
    BLOCKED = "Blocked"

class Link(Base):
    __tablename__ = "links"

    LinkID = Column(Integer, primary_key=True, index=True)
    SupplierID = Column(Integer, ForeignKey("suppliers.SupplierID"), nullable=False)
    ConsumerID = Column(Integer, ForeignKey("consumers.ConsumerID"), nullable=False)
    Status = Column(Enum(LinkStatus), default=LinkStatus.PENDING)
    RequestedAt = Column(DateTime(timezone=True), server_default=func.now())
    ApprovedAt = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    supplier = relationship("Supplier", back_populates="links")
    consumer = relationship("Consumer", back_populates="links")
    chat = relationship("Chat", back_populates="link", uselist=False, cascade="all, delete-orphan")

