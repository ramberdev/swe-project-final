# Supplier Consumer Platform (SCP) - MVP

A B2B mobile and web-based application that facilitates direct collaboration between food suppliers and institutional consumers (restaurants/hotels).

## Project Overview

The SCP is not a public marketplace—it supports direct, pre-approved relationships only. Suppliers create and manage product catalogs, and consumers can only view/order after approval by the supplier.

## Technology Stack

- **Backend**: FastAPI (Python)
- **Frontend Web**: React (Vite)
- **Mobile**: Flutter
- **Database**: PostgreSQL
- **Deployment**: 
  - Backend: Render
  - Database: Neon

## Project Structure

```
swe-project-final/
├── backend/          # FastAPI backend
├── frontend/          # React web app (Suppliers)
├── mobile/            # Flutter mobile app (Consumers & Sales)
└── README.md
```

## Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your database URL
```

4. Run database migrations:
```bash
alembic upgrade head
```

5. Start the server:
```bash
uvicorn app.main:app --reload
```

API will be available at `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

4. Start development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

### Mobile Setup

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Get dependencies:
```bash
flutter pub get
```

3. Run the app:
```bash
flutter run
```

## User Roles

### Consumer
- Send link requests to suppliers
- View supplier catalogs (after approval)
- Place orders
- Track orders
- Log complaints
- Communicate via chat
- **Access**: Mobile application

### Supplier Roles

#### Owner
- Full control over supplier account
- Create/remove Manager and Sales Representative accounts
- All Manager capabilities
- Delete/deactivate supplier account
- **Access**: Web application

#### Manager
- Manage catalog and inventory
- Handle order acceptance/rejection
- Process escalated complaints
- Oversee Sales Representatives
- View analytics and reports
- **Access**: Web application

#### Sales Representative
- Handle consumer communication via chat
- Manage first-line complaints
- Escalate unresolved issues
- View and respond to consumer inquiries
- **Access**: Mobile application

## Core Features

- ✅ Link Management System
- ✅ Catalog & Product Management
- ✅ Order Management
- ✅ Communication System (Chat)
- ✅ Complaint & Incident Management
- ✅ Supplier Onboarding (KYB)
- ✅ Real-time Notifications
- ✅ Role-based Access Control

## Database Schema

The database includes the following main tables:
- Users
- Suppliers
- Consumers
- SupplierStaff / ConsumerStaff
- Links
- Products
- Orders / OrderItems
- Chats / Messages
- Complaints / ComplaintLogs

See `backend/app/models/` for detailed schema definitions.

## API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Development

### Database Migrations

Create a new migration:
```bash
cd backend
alembic revision --autogenerate -m "description"
```

Apply migrations:
```bash
alembic upgrade head
```

### Testing

Backend API testing can be done via Swagger UI or using tools like Postman/Insomnia.

## Deployment

### Backend (Render)
1. Connect your repository to Render
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables from `.env.example`

### Database (Neon)
1. Create a PostgreSQL database on Neon
2. Update `DATABASE_URL` in your backend environment variables
3. Run migrations: `alembic upgrade head`

## License

This project is part of a software engineering course.

