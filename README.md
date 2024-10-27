# Wiener Task Casino Application

A casino application with frontend and backend components.

## Prerequisites

Before running the application, ensure you have the following installed:
- Docker
- Node.js
- npm (Node Package Manager)

## Installation & Setup

1. Clone the repository
2. cd frontend && npm install
3. cd backend && npm install
4. cd ..
5. Run the following command to build and start all services:
```bash
docker compose up --build
```

## Accessing the Application

### Frontend
- Navigate to `http://localhost:3232` in your web browser to access the frontend interface.

### Backend API
The backend API is available at `http://localhost:5252/api`

#### Available Endpoints:

| Endpoint | Method | Description | Request Body |
|----------|--------|-------------|--------------|
| `/api/casino` | GET | Retrieve casino information | - |
| `/api/casino/play` | POST | Place a bet | `{ "betAmount": 20 }` |
| `/api/casino/sim` | POST | Run casino simulation | `{ "count": 50, "betAmount": 20 }` |
| `/api/casino/rtp` | GET | Get Return To Player stats | - |

## Important Notes

The current implementation uses an in-memory object to store data. To reload or refresh the data, simply edit and save any file on the server.

## Development

For development purposes, any changes to the server files will require a save to trigger a reload of the data due to the in-memory storage implementation.
