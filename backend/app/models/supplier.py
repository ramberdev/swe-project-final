from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    SupplierID = Column(Integer, primary_key=True, index=True)
    CompanyName = Column(String(255), nullable=False)
    Address = Column(String(500))
    Phone = Column(String(50))
    Email = Column(String(255))
    VerificationStatus = Column(Boolean, default=False)  # KYB verification
    CreatedAt = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    staff = relationship("SupplierStaff", back_populates="supplier", cascade="all, delete-orphan")
    products = relationship("Product", back_populates="supplier", cascade="all, delete-orphan")
    links = relationship("Link", back_populates="supplier", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="supplier", cascade="all, delete-orphan")

