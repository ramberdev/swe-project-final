# SCP Backend API

FastAPI backend for the Supplier Consumer Platform.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file from `.env.example` and configure your database URL:
```bash
cp .env.example .env
```

4. Initialize the database:
```bash
alembic upgrade head
```

5. Run the development server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Database Migrations

Create a new migration:
```bash
alembic revision --autogenerate -m "description"
```

Apply migrations:
```bash
alembic upgrade head
```

Rollback migration:
```bash
alembic downgrade -1
```

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/  # API endpoints
│   │       └── __init__.py
│   ├── core/
│   │   ├── config.py       # Configuration
│   │   └── security.py     # Authentication & security
│   ├── models/             # SQLAlchemy models
│   ├── schemas/            # Pydantic schemas
│   └── main.py             # FastAPI app
├── alembic/                # Database migrations
└── requirements.txt
```

## Environment Variables

See `.env.example` for all available configuration options.

