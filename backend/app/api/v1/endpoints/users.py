from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.base import get_db
from app.models.user import User
from app.schemas.user import UserResponse
from typing import List

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
async def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all users"""
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID"""
    user = db.query(User).filter(User.UserID == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

