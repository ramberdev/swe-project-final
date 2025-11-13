from sqlalchemy import Column, Integer, ForeignKey, String, Numeric, Integer as SQLInteger, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base

class Product(Base):
    __tablename__ = "products"

    ProductID = Column(Integer, primary_key=True, index=True)
    SupplierID = Column(Integer, ForeignKey("suppliers.SupplierID"), nullable=False)
    Name = Column(String(255), nullable=False)
    Description = Column(Text)
    Price = Column(Numeric(10, 2), nullable=False)
    Unit = Column(String(50))  # e.g., "kg", "piece", "box"
    Stock = Column(SQLInteger, default=0)
    IsActive = Column(Boolean, default=True)
    MinimumOrderQuantity = Column(SQLInteger, default=1)
    ImageURL = Column(String(500))  # URL to product image
    DeliveryAvailable = Column(Boolean, default=True)
    PickupAvailable = Column(Boolean, default=True)
    LeadTime = Column(String(100))  # e.g., "2-3 days"
    DeliveryZones = Column(Text)  # Text description of delivery zones
    CreatedAt = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    supplier = relationship("Supplier", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")

