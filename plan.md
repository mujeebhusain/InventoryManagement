# Inventory & Order Management System — Development Plan

## 1. Project Structure

```
inventory-manager/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── product.py
│   │   │   ├── customer.py
│   │   │   └── order.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── product.py
│   │   │   ├── customer.py
│   │   │   └── order.py
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── products.py
│   │   │   ├── customers.py
│   │   │   └── orders.py
│   │   └── crud/
│   │       ├── __init__.py
│   │       ├── product.py
│   │       ├── customer.py
│   │       └── order.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Products/
│   │   │   │   ├── ProductList.jsx
│   │   │   │   ├── ProductForm.jsx
│   │   │   │   └── ProductEdit.jsx
│   │   │   ├── Customers/
│   │   │   │   ├── CustomerList.jsx
│   │   │   │   └── CustomerForm.jsx
│   │   │   └── Orders/
│   │   │       ├── OrderList.jsx
│   │   │       ├── OrderForm.jsx
│   │   │       └── OrderDetails.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   ├── Dockerfile
│   ├── .dockerignore
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## 2. Technology Choices

| Layer            | Technology                        |
|------------------|-----------------------------------|
| Backend          | Python + FastAPI                  |
| ORM              | SQLAlchemy                        |
| Database         | PostgreSQL                        |
| Frontend         | React (Vite) + React Router      |
| UI Library       | CSS (custom, responsive)          |
| HTTP Client      | Axios                             |
| Containerization | Docker + Docker Compose           |
| Backend Deploy   | Render (free tier)                |
| Frontend Deploy  | Vercel (free tier)                |
| DB Deploy        | Render PostgreSQL (free tier)     |

## 3. Development Phases

### Phase 1: Backend Development
1. Set up FastAPI project structure
2. Define SQLAlchemy models (Product, Customer, Order, OrderItem)
3. Create Pydantic schemas for request/response validation
4. Implement CRUD operations
5. Implement business logic:
   - Unique SKU validation
   - Unique email validation
   - Stock quantity >= 0 enforcement
   - Inventory check before order placement
   - Auto-reduce stock on order creation
   - Auto-calculate order total
6. Add error handling with proper HTTP status codes
7. Add CORS middleware

### Phase 2: Frontend Development
1. Initialize React project with Vite
2. Set up React Router for navigation
3. Create API service layer (Axios)
4. Build components:
   - Dashboard (summary stats)
   - Product CRUD pages
   - Customer management pages
   - Order creation and listing pages
5. Implement form validation
6. Add responsive design
7. Error/success toast notifications

### Phase 3: Containerization
1. Write backend Dockerfile (python:3.11-slim)
2. Write frontend Dockerfile (node:20-alpine build + nginx:alpine serve)
3. Write docker-compose.yml with 3 services
4. Configure environment variables via .env
5. Set up named volume for PostgreSQL data
6. Test full stack with `docker-compose up`

### Phase 4: Deployment
1. Push backend Docker image to Docker Hub
2. Deploy PostgreSQL on Render (free managed DB)
3. Deploy backend on Render (Web Service from Docker image)
4. Deploy frontend on Vercel (connect GitHub repo)
5. Configure environment variables on each platform
6. Verify end-to-end connectivity

## 4. Database Schema

### products
| Column     | Type         | Constraints          |
|------------|--------------|----------------------|
| id         | SERIAL       | PRIMARY KEY          |
| name       | VARCHAR(255) | NOT NULL             |
| sku        | VARCHAR(100) | UNIQUE, NOT NULL     |
| price      | DECIMAL(10,2)| NOT NULL, >= 0       |
| quantity   | INTEGER      | NOT NULL, DEFAULT 0, >= 0 |
| created_at | TIMESTAMP    | DEFAULT NOW()        |

### customers
| Column     | Type         | Constraints          |
|------------|--------------|----------------------|
| id         | SERIAL       | PRIMARY KEY          |
| name       | VARCHAR(255) | NOT NULL             |
| email      | VARCHAR(255) | UNIQUE, NOT NULL     |
| phone      | VARCHAR(50)  | NOT NULL             |
| created_at | TIMESTAMP    | DEFAULT NOW()        |

### orders
| Column      | Type         | Constraints          |
|-------------|--------------|----------------------|
| id          | SERIAL       | PRIMARY KEY          |
| customer_id | INTEGER      | FK -> customers.id   |
| total_amount| DECIMAL(10,2)| NOT NULL             |
| status      | VARCHAR(50)  | DEFAULT 'pending'    |
| created_at  | TIMESTAMP    | DEFAULT NOW()        |

### order_items
| Column     | Type         | Constraints          |
|------------|--------------|----------------------|
| id         | SERIAL       | PRIMARY KEY          |
| order_id   | INTEGER      | FK -> orders.id      |
| product_id | INTEGER      | FK -> products.id    |
| quantity   | INTEGER      | NOT NULL, > 0        |
| unit_price | DECIMAL(10,2)| NOT NULL             |

## 5. API Endpoints Summary

### Products
- `POST   /products`       — Create product
- `GET    /products`       — List all products
- `GET    /products/{id}`  — Get product by ID
- `PUT    /products/{id}`  — Update product
- `DELETE /products/{id}`  — Delete product

### Customers
- `POST   /customers`       — Create customer
- `GET    /customers`       — List all customers
- `GET    /customers/{id}`  — Get customer by ID
- `DELETE /customers/{id}`  — Delete customer

### Orders
- `POST   /orders`       — Create order
- `GET    /orders`       — List all orders
- `GET    /orders/{id}`  — Get order by ID
- `DELETE /orders/{id}`  — Cancel/delete order

### Dashboard
- `GET    /dashboard`    — Get summary stats (total products, customers, orders, low stock items)

## 6. Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@db:5432/inventory_db

# Backend
BACKEND_PORT=8000
CORS_ORIGINS=http://localhost:5173,https://your-frontend.vercel.app

# Frontend (build-time)
VITE_API_URL=http://localhost:8000
```

## 7. Docker Compose Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│   Backend   │────▶│  PostgreSQL  │
│  (nginx)    │     │  (FastAPI)  │     │   (DB)      │
│  Port 80    │     │  Port 8000  │     │  Port 5432  │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                        [named volume]
```

## 8. Deployment Configuration (see section below)

Refer to the "Deployment Setup Guide" section for accounts and configuration needed.

---

## Deployment Setup Guide

### Accounts to Create (Free)
1. **GitHub** — for version control (you likely have this)
2. **Docker Hub** — hub.docker.com (for pushing backend image)
3. **Render** — render.com (for backend + PostgreSQL hosting)
4. **Vercel** — vercel.com (for frontend hosting)

### Render Setup (Backend + Database)
1. Sign up at render.com with GitHub
2. Create a **PostgreSQL** database (free tier):
   - Note down the **External Database URL** provided
3. Create a **Web Service**:
   - Connect your GitHub repo
   - Set root directory to `backend`
   - Environment: Docker
   - Add env vars:
     - `DATABASE_URL` = (the Render PostgreSQL internal URL)
     - `CORS_ORIGINS` = your Vercel frontend URL

### Vercel Setup (Frontend)
1. Sign up at vercel.com with GitHub
2. Import the GitHub repo
3. Set root directory to `frontend`
4. Framework preset: Vite
5. Add env var:
   - `VITE_API_URL` = your Render backend URL (e.g., https://your-backend.onrender.com)

### Docker Hub Setup
1. Sign up at hub.docker.com
2. Create a repository (e.g., `yourusername/inventory-backend`)
3. Login locally: `docker login`
4. Build & push:
   ```bash
   docker build -t yourusername/inventory-backend ./backend
   docker push yourusername/inventory-backend
   ```

---

## Estimated Deliverables Checklist

- [ ] GitHub repository with full source code
- [ ] Docker Hub image link for backend
- [ ] Live frontend URL (Vercel)
- [ ] Live backend API URL (Render)
- [ ] docker-compose.yml running all 3 services locally
- [ ] README with setup instructions
