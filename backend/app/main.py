from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.models.base import Base, engine
from app.api.v1 import api_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Supplier Consumer Platform API",
    description="B2B platform for food suppliers and institutional consumers",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Supplier Consumer Platform API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

