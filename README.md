# Inventory & Order Management System

A full-stack containerized application for managing products, customers, and orders.

## Tech Stack

- **Frontend:** React (Vite) + React Router + Axios
- **Backend:** Python + FastAPI + SQLAlchemy
- **Database:** PostgreSQL
- **Containerization:** Docker + Docker Compose

## Quick Start (Docker)

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd inventory-manager
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Local Development (without Docker)

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
# Set DATABASE_URL env var pointing to your PostgreSQL
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Products
- `POST /products/` — Create product
- `GET /products/` — List all products
- `GET /products/{id}` — Get product
- `PUT /products/{id}` — Update product
- `DELETE /products/{id}` — Delete product

### Customers
- `POST /customers/` — Create customer
- `GET /customers/` — List all customers
- `GET /customers/{id}` — Get customer
- `DELETE /customers/{id}` — Delete customer

### Orders
- `POST /orders/` — Create order
- `GET /orders/` — List all orders
- `GET /orders/{id}` — Get order details
- `DELETE /orders/{id}` — Cancel order

### Dashboard
- `GET /dashboard/` — Summary stats

## Deployment

- **Backend:** Deployed on Render
- **Frontend:** Deployed on Vercel
- **Database:** Render PostgreSQL

## Docker Hub

```bash
docker build -t yourusername/inventory-backend ./backend
docker push yourusername/inventory-backend
```
