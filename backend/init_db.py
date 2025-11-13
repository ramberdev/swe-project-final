"""
Database initialization script
Run this after setting up your database to create all tables
"""
from app.models.base import Base, engine
from app.models import *  # Import all models

if __name__ == "__main__":
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

