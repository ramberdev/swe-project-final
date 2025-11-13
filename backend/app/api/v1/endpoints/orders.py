from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.base import get_db
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderResponse, OrderUpdate
from typing import List
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(order: OrderCreate, consumer_staff_id: int, db: Session = Depends(get_db)):
    """Create a new order"""
    # Calculate total and create order items
    total_amount = 0
    order_items = []
    
    for item in order.items:
        product = db.query(Product).filter(Product.ProductID == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        
        if product.Stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for product {product.Name}"
            )
        
        subtotal = product.Price * item.quantity
        total_amount += subtotal
        
        order_items.append(OrderItem(
            ProductID=item.product_id,
            Quantity=item.quantity,
            UnitPrice=product.Price,
            Subtotal=subtotal
        ))
    
    # Create order
    db_order = Order(
        SupplierID=order.supplier_id,
        ConsumerID=order.consumer_id,
        ConsumerStaffID=consumer_staff_id,
        TotalAmount=total_amount,
        DeliveryDate=order.delivery_date,
        Status=OrderStatus.PENDING
    )
    db.add(db_order)
    db.flush()  # Get OrderID
    
    # Add order items
    for item in order_items:
        item.OrderID = db_order.OrderID
        db.add(item)
    
    db.commit()
    db.refresh(db_order)
    return db_order

@router.get("/", response_model=List[OrderResponse])
async def get_orders(
    supplier_id: int = None,
    consumer_id: int = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get orders, optionally filtered by supplier or consumer"""
    query = db.query(Order)
    if supplier_id:
        query = query.filter(Order.SupplierID == supplier_id)
    if consumer_id:
        query = query.filter(Order.ConsumerID == consumer_id)
    orders = query.offset(skip).limit(limit).all()
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: int, db: Session = Depends(get_db)):
    """Get order by ID"""
    order = db.query(Order).filter(Order.OrderID == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.patch("/{order_id}", response_model=OrderResponse)
async def update_order(order_id: int, order_update: OrderUpdate, db: Session = Depends(get_db)):
    """Update order status"""
    db_order = db.query(Order).filter(Order.OrderID == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order_update.status:
        db_order.Status = order_update.status
    if order_update.rejection_reason:
        db_order.RejectionReason = order_update.rejection_reason
    if order_update.delivery_date:
        db_order.DeliveryDate = order_update.delivery_date
    
    db.commit()
    db.refresh(db_order)
    return db_order

