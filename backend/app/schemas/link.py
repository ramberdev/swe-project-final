from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.link import LinkStatus

class LinkCreate(BaseModel):
    supplier_id: int
    consumer_id: int

class LinkUpdate(BaseModel):
    status: LinkStatus

class LinkResponse(BaseModel):
    LinkID: int
    SupplierID: int
    ConsumerID: int
    Status: LinkStatus
    RequestedAt: datetime
    ApprovedAt: Optional[datetime] = None

    class Config:
        from_attributes = True

