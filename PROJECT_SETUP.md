# Project Setup Guide

This document provides step-by-step instructions for setting up the SCP project.

## Prerequisites

- Python 3.9+ (for backend)
- Node.js 18+ and npm (for frontend)
- Flutter SDK (for mobile app)
- PostgreSQL database (local or Neon cloud)

## Initial Setup

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and set your DATABASE_URL

# Initialize database (choose one method):
# Option A: Using Alembic migrations (recommended)
alembic upgrade head

# Option B: Using init script
python init_db.py

# Run the server
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional, defaults to localhost:8000)
echo "VITE_API_BASE_URL=http://localhost:8000/api/v1" > .env

# Run development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

### 3. Mobile Setup

```bash
cd mobile

# Get dependencies
flutter pub get

# Run on connected device/emulator
flutter run
```

## Database Configuration

### Local PostgreSQL

1. Install PostgreSQL
2. Create database:
```sql
CREATE DATABASE scp_db;
```
3. Update `.env`:
```
DATABASE_URL=postgresql://username:password@localhost:5432/scp_db
```

### Neon (Cloud)

1. Create account at https://neon.tech
2. Create a new project
3. Copy the connection string
4. Update `.env`:
```
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Testing the Setup

1. **Backend**: Visit `http://localhost:8000/docs` - you should see the Swagger UI
2. **Frontend**: Visit `http://localhost:3000` - you should see the app
3. **Mobile**: Run `flutter run` and verify the app launches

## Common Issues

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Port Already in Use
- Backend: Change port with `--port 8001`
- Frontend: Change port in `vite.config.js`

### Import Errors
- Ensure virtual environment is activated (backend)
- Run `npm install` (frontend)
- Run `flutter pub get` (mobile)

## Next Steps

1. Create your first user via `/api/v1/auth/register`
2. Create a supplier account
3. Create a consumer account
4. Test the link request flow
5. Add products to catalog
6. Test order creation

## Development Workflow

1. Make changes to code
2. Backend: Server auto-reloads (if using --reload)
3. Frontend: Vite hot-reloads automatically
4. Mobile: Use hot reload (press 'r' in terminal)

## Database Migrations

When you modify models:

```bash
cd backend
alembic revision --autogenerate -m "description of changes"
alembic upgrade head
```

## Project Structure Overview

```
swe-project-final/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── core/        # Configuration & security
│   │   ├── models/      # Database models
│   │   ├── schemas/     # Pydantic schemas
│   │   └── main.py      # FastAPI app
│   ├── alembic/         # Database migrations
│   └── requirements.txt
├── frontend/            # React web app
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── services/    # API services
│   └── package.json
└── mobile/              # Flutter mobile app
    └── lib/
        ├── models/      # Data models
        ├── screens/     # Screen widgets
        └── services/    # API services
```

## Support

For issues or questions, refer to:
- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
- Mobile: `mobile/README.md`
- Database Schema: `backend/DATABASE_SCHEMA.md`

