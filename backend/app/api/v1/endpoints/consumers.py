from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.base import get_db
from app.models.consumer import Consumer
from app.schemas.consumer import ConsumerCreate, ConsumerResponse
from typing import List

router = APIRouter()

@router.post("/", response_model=ConsumerResponse, status_code=status.HTTP_201_CREATED)
async def create_consumer(consumer: ConsumerCreate, db: Session = Depends(get_db)):
    """Create a new consumer"""
    db_consumer = Consumer(
        CompanyName=consumer.company_name,
        Address=consumer.address,
        Phone=consumer.phone,
        Email=consumer.email,
        Type=consumer.type
    )
    db.add(db_consumer)
    db.commit()
    db.refresh(db_consumer)
    return db_consumer

@router.get("/", response_model=List[ConsumerResponse])
async def get_consumers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all consumers"""
    consumers = db.query(Consumer).offset(skip).limit(limit).all()
    return consumers

@router.get("/{consumer_id}", response_model=ConsumerResponse)
async def get_consumer(consumer_id: int, db: Session = Depends(get_db)):
    """Get consumer by ID"""
    consumer = db.query(Consumer).filter(Consumer.ConsumerID == consumer_id).first()
    if not consumer:
        raise HTTPException(status_code=404, detail="Consumer not found")
    return consumer

