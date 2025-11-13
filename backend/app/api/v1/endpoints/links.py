from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.base import get_db
from app.models.link import Link, LinkStatus
from app.schemas.link import LinkCreate, LinkResponse, LinkUpdate
from typing import List

router = APIRouter()

@router.post("/", response_model=LinkResponse, status_code=status.HTTP_201_CREATED)
async def create_link(link: LinkCreate, db: Session = Depends(get_db)):
    """Create a link request"""
    # Check if link already exists
    existing_link = db.query(Link).filter(
        Link.SupplierID == link.supplier_id,
        Link.ConsumerID == link.consumer_id
    ).first()
    
    if existing_link:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Link already exists"
        )
    
    db_link = Link(
        SupplierID=link.supplier_id,
        ConsumerID=link.consumer_id,
        Status=LinkStatus.PENDING
    )
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link

@router.get("/", response_model=List[LinkResponse])
async def get_links(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all links"""
    links = db.query(Link).offset(skip).limit(limit).all()
    return links

@router.patch("/{link_id}", response_model=LinkResponse)
async def update_link(link_id: int, link_update: LinkUpdate, db: Session = Depends(get_db)):
    """Update link status (approve/reject/remove/block)"""
    db_link = db.query(Link).filter(Link.LinkID == link_id).first()
    if not db_link:
        raise HTTPException(status_code=404, detail="Link not found")
    
    db_link.Status = link_update.status
    if link_update.status == LinkStatus.APPROVED:
        from datetime import datetime
        db_link.ApprovedAt = datetime.utcnow()
    
    db.commit()
    db.refresh(db_link)
    return db_link

