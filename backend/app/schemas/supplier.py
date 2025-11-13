from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class SupplierBase(BaseModel):
    company_name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None

class SupplierCreate(SupplierBase):
    pass

class SupplierResponse(SupplierBase):
    SupplierID: int
    verification_status: bool
    CreatedAt: datetime

    class Config:
        from_attributes = True

