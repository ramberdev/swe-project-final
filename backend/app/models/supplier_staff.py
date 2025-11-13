from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.models.base import Base

class SupplierStaffRole(str, enum.Enum):
    OWNER = "Owner"
    MANAGER = "Manager"
    SALES = "Sales Representative"

class SupplierStaff(Base):
    __tablename__ = "supplier_staff"

    StaffID = Column(Integer, primary_key=True, index=True)
    UserID = Column(Integer, ForeignKey("users.UserID"), nullable=False)
    SupplierID = Column(Integer, ForeignKey("suppliers.SupplierID"), nullable=False)
    Role = Column(Enum(SupplierStaffRole), nullable=False)
    JoinedAt = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="supplier_staff")
    supplier = relationship("Supplier", back_populates="staff")
    complaints = relationship("Complaint", back_populates="supplier_staff")

