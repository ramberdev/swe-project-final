from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from app.models.order import OrderStatus

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderItemResponse(BaseModel):
    OrderItemID: int
    ProductID: int
    Quantity: int
    UnitPrice: Decimal
    Subtotal: Decimal

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    supplier_id: int
    consumer_id: int
    items: List[OrderItemCreate]
    delivery_date: Optional[datetime] = None

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    rejection_reason: Optional[str] = None
    delivery_date: Optional[datetime] = None

class OrderResponse(BaseModel):
    OrderID: int
    SupplierID: int
    ConsumerID: int
    ConsumerStaffID: int
    OrderDate: datetime
    Status: OrderStatus
    TotalAmount: Decimal
    DeliveryDate: Optional[datetime] = None
    RejectionReason: Optional[str] = None
    order_items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

