from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.base import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from typing import List

router = APIRouter()

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    """Create a new product"""
    db_product = Product(
        SupplierID=product.supplier_id,
        Name=product.name,
        Description=product.description,
        Price=product.price,
        Unit=product.unit,
        Stock=product.stock,
        MinimumOrderQuantity=product.minimum_order_quantity,
        ImageURL=product.image_url,
        DeliveryAvailable=product.delivery_available,
        PickupAvailable=product.pickup_available,
        LeadTime=product.lead_time,
        DeliveryZones=product.delivery_zones
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/", response_model=List[ProductResponse])
async def get_products(supplier_id: int = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get products, optionally filtered by supplier"""
    query = db.query(Product)
    if supplier_id:
        query = query.filter(Product.SupplierID == supplier_id)
    products = query.offset(skip).limit(limit).all()
    return products

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get product by ID"""
    product = db.query(Product).filter(Product.ProductID == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.patch("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: int, product_update: ProductUpdate, db: Session = Depends(get_db)):
    """Update product"""
    db_product = db.query(Product).filter(Product.ProductID == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_update.model_dump(exclude_unset=True)
    # Map snake_case to PascalCase
    field_mapping = {
        "name": "Name",
        "description": "Description",
        "price": "Price",
        "unit": "Unit",
        "stock": "Stock",
        "minimum_order_quantity": "MinimumOrderQuantity",
        "image_url": "ImageURL",
        "is_active": "IsActive",
        "delivery_available": "DeliveryAvailable",
        "pickup_available": "PickupAvailable",
        "lead_time": "LeadTime",
        "delivery_zones": "DeliveryZones"
    }
    
    for field, value in update_data.items():
        db_field = field_mapping.get(field, field)
        setattr(db_product, db_field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

