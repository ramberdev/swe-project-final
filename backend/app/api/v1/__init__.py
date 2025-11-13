from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, suppliers, consumers, links, products, orders, chat, complaints

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(suppliers.router, prefix="/suppliers", tags=["Suppliers"])
api_router.include_router(consumers.router, prefix="/consumers", tags=["Consumers"])
api_router.include_router(links.router, prefix="/links", tags=["Links"])
api_router.include_router(products.router, prefix="/products", tags=["Products"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(complaints.router, prefix="/complaints", tags=["Complaints"])

