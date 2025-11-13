from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.consumer import ConsumerType

class ConsumerBase(BaseModel):
    company_name: str
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    type: ConsumerType = ConsumerType.RESTAURANT

class ConsumerCreate(ConsumerBase):
    pass

class ConsumerResponse(ConsumerBase):
    ConsumerID: int
    CreatedAt: datetime

    class Config:
        from_attributes = True

