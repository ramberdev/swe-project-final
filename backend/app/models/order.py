from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum, Numeric, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.models.base import Base

class OrderStatus(str, enum.Enum):
    PENDING = "Pending"
    ACCEPTED = "Accepted"
    REJECTED = "Rejected"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class Order(Base):
    __tablename__ = "orders"

    OrderID = Column(Integer, primary_key=True, index=True)
    SupplierID = Column(Integer, ForeignKey("suppliers.SupplierID"), nullable=False)
    ConsumerID = Column(Integer, ForeignKey("consumers.ConsumerID"), nullable=False)
    ConsumerStaffID = Column(Integer, ForeignKey("consumer_staff.StaffID"), nullable=False)
    OrderDate = Column(DateTime(timezone=True), server_default=func.now())
    Status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    TotalAmount = Column(Numeric(10, 2), nullable=False)
    DeliveryDate = Column(DateTime(timezone=True), nullable=True)
    RejectionReason = Column(String(500), nullable=True)

    # Relationships
    supplier = relationship("Supplier", back_populates="orders")
    consumer = relationship("Consumer", back_populates="orders")
    consumer_staff = relationship("ConsumerStaff", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    complaints = relationship("Complaint", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    OrderItemID = Column(Integer, primary_key=True, index=True)
    OrderID = Column(Integer, ForeignKey("orders.OrderID"), nullable=False)
    ProductID = Column(Integer, ForeignKey("products.ProductID"), nullable=False)
    Quantity = Column(Integer, nullable=False)
    UnitPrice = Column(Numeric(10, 2), nullable=False)
    Subtotal = Column(Numeric(10, 2), nullable=False)

    # Relationships
    order = relationship("Order", back_populates="order_items")
    product = relationship("Product", back_populates="order_items")

