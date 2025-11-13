from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import UserRole

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.REGULAR

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    UserID: int
    Role: UserRole
    CreatedAt: datetime

    class Config:
        from_attributes = True

