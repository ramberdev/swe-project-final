from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.complaint import ComplaintStatus, ComplaintPriority

class ComplaintCreate(BaseModel):
    order_id: int
    title: str
    description: str
    priority: ComplaintPriority = ComplaintPriority.MEDIUM

class ComplaintUpdate(BaseModel):
    status: Optional[ComplaintStatus] = None
    priority: Optional[ComplaintPriority] = None
    supplier_staff_id: Optional[int] = None  # For assignment

class ComplaintLogResponse(BaseModel):
    LogID: int
    ComplaintID: int
    UserID: int
    Action: str
    Notes: Optional[str] = None
    Timestamp: datetime

    class Config:
        from_attributes = True

class ComplaintResponse(BaseModel):
    ComplaintID: int
    OrderID: int
    ConsumerStaffID: int
    SupplierStaffID: Optional[int] = None
    Title: str
    Description: str
    Status: ComplaintStatus
    Priority: ComplaintPriority
    CreatedAt: datetime
    ResolvedAt: Optional[datetime] = None
    logs: List[ComplaintLogResponse] = []

    class Config:
        from_attributes = True

