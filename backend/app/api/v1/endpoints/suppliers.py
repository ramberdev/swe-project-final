from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.base import get_db
from app.models.supplier import Supplier
from app.schemas.supplier import SupplierCreate, SupplierResponse
from typing import List

router = APIRouter()

@router.post("/", response_model=SupplierResponse, status_code=status.HTTP_201_CREATED)
async def create_supplier(supplier: SupplierCreate, db: Session = Depends(get_db)):
    """Create a new supplier"""
    db_supplier = Supplier(
        CompanyName=supplier.company_name,
        Address=supplier.address,
        Phone=supplier.phone,
        Email=supplier.email
    )
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

@router.get("/", response_model=List[SupplierResponse])
async def get_suppliers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all suppliers"""
    suppliers = db.query(Supplier).offset(skip).limit(limit).all()
    return suppliers

@router.get("/{supplier_id}", response_model=SupplierResponse)
async def get_supplier(supplier_id: int, db: Session = Depends(get_db)):
    """Get supplier by ID"""
    supplier = db.query(Supplier).filter(Supplier.SupplierID == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier

