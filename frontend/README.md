# SCP Frontend

React web application for the Supplier Consumer Platform (Supplier side - Owners and Managers).

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

3. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Build

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/    # Reusable components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── utils/         # Utility functions
│   ├── contexts/      # React contexts
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
└── package.json
```

