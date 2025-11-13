from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal
    unit: Optional[str] = None
    stock: int = 0
    minimum_order_quantity: int = 1
    image_url: Optional[str] = None
    delivery_available: bool = True
    pickup_available: bool = True
    lead_time: Optional[str] = None
    delivery_zones: Optional[str] = None

class ProductCreate(ProductBase):
    supplier_id: int

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    unit: Optional[str] = None
    stock: Optional[int] = None
    minimum_order_quantity: Optional[int] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
    delivery_available: Optional[bool] = None
    pickup_available: Optional[bool] = None
    lead_time: Optional[str] = None
    delivery_zones: Optional[str] = None

class ProductResponse(ProductBase):
    ProductID: int
    SupplierID: int
    IsActive: bool
    CreatedAt: datetime

    class Config:
        from_attributes = True

