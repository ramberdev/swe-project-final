from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.base import get_db
from app.models.complaint import Complaint, ComplaintLog, ComplaintStatus
from app.schemas.complaint import ComplaintCreate, ComplaintResponse, ComplaintUpdate, ComplaintLogResponse
from typing import List
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
async def create_complaint(complaint: ComplaintCreate, consumer_staff_id: int, db: Session = Depends(get_db)):
    """Create a new complaint"""
    db_complaint = Complaint(
        OrderID=complaint.order_id,
        ConsumerStaffID=consumer_staff_id,
        Title=complaint.title,
        Description=complaint.description,
        Priority=complaint.priority,
        Status=ComplaintStatus.OPEN
    )
    db.add(db_complaint)
    db.flush()
    
    # Create initial log
    log = ComplaintLog(
        ComplaintID=db_complaint.ComplaintID,
        UserID=consumer_staff_id,
        Action="Created",
        Notes="Complaint created"
    )
    db.add(log)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

@router.get("/", response_model=List[ComplaintResponse])
async def get_complaints(
    order_id: int = None,
    supplier_id: int = None,
    consumer_id: int = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get complaints with optional filters"""
    query = db.query(Complaint)
    if order_id:
        query = query.filter(Complaint.OrderID == order_id)
    # Add more filters as needed
    complaints = query.offset(skip).limit(limit).all()
    return complaints

@router.get("/{complaint_id}", response_model=ComplaintResponse)
async def get_complaint(complaint_id: int, db: Session = Depends(get_db)):
    """Get complaint by ID"""
    complaint = db.query(Complaint).filter(Complaint.ComplaintID == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint

@router.patch("/{complaint_id}", response_model=ComplaintResponse)
async def update_complaint(
    complaint_id: int,
    complaint_update: ComplaintUpdate,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Update complaint (assign, escalate, resolve)"""
    db_complaint = db.query(Complaint).filter(Complaint.ComplaintID == complaint_id).first()
    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    action = "Updated"
    if complaint_update.status:
        db_complaint.Status = complaint_update.status
        if complaint_update.status == ComplaintStatus.RESOLVED:
            db_complaint.ResolvedAt = datetime.utcnow()
            action = "Resolved"
        elif complaint_update.status == ComplaintStatus.ESCALATED:
            action = "Escalated"
    
    if complaint_update.priority:
        db_complaint.Priority = complaint_update.priority
    
    if complaint_update.supplier_staff_id:
        db_complaint.SupplierStaffID = complaint_update.supplier_staff_id
        action = "Assigned"
    
    # Create log entry
    log = ComplaintLog(
        ComplaintID=complaint_id,
        UserID=user_id,
        Action=action,
        Notes=f"Complaint {action.lower()}"
    )
    db.add(log)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

