# LuxeBeauty — Luxury Cosmetics E-Commerce Platform

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Sequelize](https://img.shields.io/badge/Sequelize-v6%20ORM-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)](https://sequelize.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-REST%20API-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-17+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux-State%20Management-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux.js.org/)
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage%20Container-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![Jest](https://img.shields.io/badge/Tested%20with-Jest%20%26%20Supertest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![Stripe](https://img.shields.io/badge/Stripe-Payment%20Gateway%20%26%20Webhooks-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-Swagger%203.0%20Docs-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](http://localhost:4000/api-docs)

> An enterprise-grade, portfolio-level cosmetics e-commerce platform built on the **PERN stack** (PostgreSQL, Express.js, React.js, Node.js). Engineered with ACID database transactions, multi-role RBAC security, multi-variant SKU architecture, automated CI/CD workflows, Docker containerization, and interactive Swagger API documentation.

---

## 📑 Table of Contents

1. [Architecture & System Design](#-architecture--system-design)
2. [Why PERN Stack? (Architectural Decision)](#-why-pern-stack-architectural-decision)
3. [Key Enterprise Features](#-key-enterprise-features)
4. [Multi-Role Portals & Dashboards](#-multi-role-portals--dashboards)
5. [Docker & Containerized Deployment](#-docker--containerized-deployment)
6. [CI/CD Pipeline (GitHub Actions)](#-cicd-pipeline-github-actions)
7. [Interactive Swagger API Documentation](#-interactive-swagger-api-documentation)
8. [Automated Testing Suite](#-automated-testing-suite)
9. [Skills & Engineering Standards Demonstrated](#-skills--engineering-standards-demonstrated)
10. [Demo Credentials & Quick Login](#-demo-credentials--quick-login)
11. [Local Installation & Setup](#-local-installation--setup)
12. [Cloud Deployment Guide](#-cloud-deployment-guide)
13. [REST API Reference](#-rest-api-reference)
14. [Project Structure](#-project-structure)
15. [License](#-license)

---

## 🏛️ Architecture & System Design

```
                                 ┌──────────────────────────────────────────────┐
                                 │                CLIENT LAYER                  │
                                 │       React.js SPA + Redux State Store       │
                                 │   Shimmer Skeletons, Swatches & Stepper UI   │
                                 └──────────────────────┬───────────────────────┘
                                                        │ HTTP / Secure Cookie JWT
                                                        ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       EXPRESS.JS BACKEND GATEWAY                                       │
│                                                                                                        │
│  [Helmet Security]  ──►  [Rate Limiters (Auth & API)]  ──►  [Gzip Compression]  ──►  [Swagger /api-docs] │
│                                                                                                        │
│  [Stripe Webhooks (/webhook)] (Raw HMAC Signature Validation)                                          │
│                                                                                                        │
│  [Controllers] ──► [Service Layer (ProductService, OrderService)] ──► [Multi-Tier Cache (Redis / Mem)]│
└───────────────────────────────────────────────┬────────────────────────────────────────────────────────┘
                                                │
                                                ▼ Sequelize ORM
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   POSTGRESQL RELATIONAL DATABASE                                      │
│                                                                                                        │
│   • ACID Transactions on Checkout & Inventory Deduction (Prevent Overselling & Race Conditions)        │
│   • Tables: Users (RBAC), Products, ProductVariants (JSONB), Orders, OrderItems, Reviews, Wishlists,   │
│     Coupons, Payments                                                                                  │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 💡 Why PERN Stack? (Architectural Decision)

E-commerce backends handle deeply interdependent relational data:
- **Relational Integrity**: Customers, orders, order items, coupons, and seller inventory have strict foreign key relationships that require referential consistency.
- **ACID Transactions**: When a customer purchases multiple items, stock decrement and order creation must succeed or fail as a single unit of work. PostgreSQL provides true transactional isolation (`SERIALIZABLE` / `READ COMMITTED`) preventing oversell race conditions.
- **Production Standard**: PostgreSQL is widely considered the industry benchmark for commercial financial systems and transactional commerce platforms.

---

## ✨ Key Enterprise Features

- **⚡ ACID Database Transactions & Inventory Safety**:
  - Checkout and stock deductions are executed inside isolated `sequelize.transaction()` blocks.
  - Pre-validates variant stock availability before decrementing; automatically rolls back changes and restores inventory upon order cancellation.
- **🛡️ Strict Seller Scoping & RBAC**:
  - Dedicated access control for **Customers**, **Sellers**, and **Admins**.
  - Sellers can only inspect, edit, or delete catalog items they authored, and view orders containing their line items.
- **🎨 Multi-Variant Cosmetic Shades & SKU Engine**:
  - Products support individual SKUs and multiple variant options (e.g. lipstick shades like *Ruby Rouge*, *Nude Petal*, *Velvet Plum*; foundation tones; bottle volumes).
  - Interactive swatch selectors on product pages dynamically update pricing, SKU, and available stock limits.
- **💳 Production-Grade Stripe Webhooks**:
  - Cryptographic HMAC signature verification (`stripe.webhooks.constructEvent`) on `/api/v1/stripe/webhook` with raw binary body parsing.
  - Automatically reconciles `payment_intent.succeeded`, `payment_intent.payment_failed`, and `charge.refunded` events.
- **💖 Customer Wishlist System (`/wishlist`)**:
  - Dedicated wishlist model, endpoints, Redux store, and 1-click heart toggles with "Move to Cart" actions.
- **🎟️ Promotional Coupons & Discounts**:
  - Validates discount codes (`LUXE10`, `WELCOME20`, `FLAT500`, `GLOWVIP`) against minimum order spend and expiration dates.
- **🚚 5-Step Order Shipment Tracker (`/order/:id`)**:
  - Real-time stepper: `Order Placed` ➔ `Payment Confirmed` ➔ `Processing & Packed` ➔ `Dispatched & In Transit` ➔ `Delivered`.
- **🧾 Itemized Invoice Receipts (`/process/payment`)**:
  - Printable receipt with live tax, shipping, and billing details alongside card payment fields.
- **⭐ Advanced Customer Review System**:
  - Rating breakdown distribution card (5★ through 1★ percentage bars), verified buyer badges, and helpful review voting.
- **🚀 Performance Optimization**:
  - Gzip response compression (`compression` middleware).
  - Static asset caching (`Cache-Control: public, max-age=86400`).
  - Shimmering skeleton loaders with pre-reserved aspect ratios preventing Cumulative Layout Shift (CLS).

---

## 👥 Multi-Role Portals & Dashboards

| Role | Portal Route | Capabilities |
| :--- | :--- | :--- |
| **Customer** | `/dashboard` | Order history, active shipment statuses, shopping bag summary, saved wishlist. |
| **Seller** | `/seller/dashboard` | Merchant sales charts, inventory health doughnut, scoped catalog & order operations. |
| **Admin** | `/admin/dashboard` | Platform gross revenue, user demographic breakdown, global product & order moderation. |

---

## 🐳 Docker & Containerized Deployment

LuxeBeauty features a multi-stage production `Dockerfile` and `docker-compose.yml` orchestrating PostgreSQL, Redis, and the full-stack Node.js runtime:

```bash
# 1. Build and launch all services in detached mode
docker-compose up -d --build

# 2. View running service logs
docker-compose logs -f app

# 3. Stop containers and preserve database volumes
docker-compose down
```

The application will be live at `http://localhost:4000`.

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Located at [`.github/workflows/ci.yml`](.github/workflows/ci.yml):
- **Automated Service Container**: Spawns an isolated PostgreSQL 15 container for automated testing.
- **Root & Frontend Dependencies**: Installs dependencies with `npm ci`.
- **Database Seeding**: Runs automated migrations and user/product/coupon seeders.
- **Automated Test Execution**: Runs 5 Jest + Supertest suites ensuring 0 regression errors.
- **Frontend Build**: Compiles production React assets.
- **Docker Build Validation**: Validates multi-stage Docker build artifact.

---

## 📖 Interactive Swagger API Documentation

Interactive OpenAPI 3.0 documentation is served live at:
```
http://localhost:4000/api-docs
```
Allows testing all authentication, product, order, coupon, and webhook endpoints directly from the browser.

---

## 🧪 Automated Testing Suite

Run the automated backend test suite with Jest & Supertest:

```bash
npm test
```

### Test Coverage Summary:
- **`health.test.js`**: System uptime, environment healthcheck (`/health`), and Swagger docs route.
- **`security.test.js`**: Helmet headers (`nosniff`, `frame-options`), rate limiting headers, and 401 response handling.
- **`webhook.test.js`**: Cryptographic Stripe webhook event handling (`payment_intent.succeeded` & `payment_intent.payment_failed`).
- **`coupon.test.js`**: Percentage discounts (`LUXE10`), flat discounts (`FLAT500`), and invalid code rejection (`404`).
- **`product.test.js`**: Product catalog retrieval, category filtering, SKUs, and variant arrays.

---

## 🎓 Skills & Engineering Standards Demonstrated

| Skill Area | Implementation in LuxeBeauty |
| :--- | :--- |
| **ES6+ JavaScript & Node.js** | Async/await, modular ES modules, stream handling, raw buffers. |
| **Express Architecture** | Layered design: Controllers, Service Layer, Repositories, Centralized Error Handling. |
| **PostgreSQL & Advanced SQL** | Relational schemas, indexing (`category`, `price`), JSONB variants, transactions. |
| **Cybersecurity & Auth** | JWT with HttpOnly SameSite/Secure cookies, Helmet headers, IP rate limiters. |
| **React & Modern UI** | Custom Hooks, Redux store, CSS Grid, Fluid Typography (`clamp`), Shimmer Skeletons. |
| **Automated Testing** | Jest test runner, Supertest HTTP mocking, CI database service containers. |
| **DevOps & CI/CD** | Multi-stage Docker builds, Docker Compose orchestration, GitHub Actions CI pipeline. |
| **API Design & Docs** | RESTful design standards, OpenAPI 3.0 Swagger UI documentation. |

---

## 🔑 Demo Credentials & Quick Login

Pre-seeded credentials for instant multi-role testing (also accessible via 1-click autofill on `/login`):

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@luxebeauty.com` | `Password123!` | Public catalog, cart, orders, wishlist |
| **Seller** | `seller@luxebeauty.com` | `Password123!` | Merchant dashboard, owned product management |
| **Admin** | `admin@luxebeauty.com` | `Password123!` | Master admin panel, user & review moderation |

---

## 💻 Local Installation & Setup

### 1. Prerequisites
- **Node.js** v18+ & **npm** v9+
- **PostgreSQL** v14+ running locally or hosted (Neon, Render, Supabase)

### 2. Clone & Install
```bash
git clone https://github.com/your-username/LuxeBeauty.git
cd LuxeBeauty

# Install root backend dependencies
npm install

# Install frontend dependencies
npm install --prefix frontend
```

### 3. Environment Configuration
Create `backend/config/config.env` (refer to `config.env.example`):
```env
PORT=4000
NODE_ENV=development
DB_URI=postgres://postgres:password@127.0.0.1:5432/luxebeauty
DB_SSL=false
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=5d
COOKIE_EXPIRE=5
STRIPE_API_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
REDIS_URL=redis://127.0.0.1:6379
```

### 4. Database Seeding
```bash
# Seed demo accounts, promotional coupons, and cosmetics catalog
npm run seed:all
```

### 5. Start Development Server
```bash
# Terminal 1: Start backend API
npm run dev

# Terminal 2: Start React frontend
cd frontend
npm start
```

---

## ☁️ Cloud Deployment Guide

### Deploying to Render / Railway / Heroku

1. **Database**: Provision a managed PostgreSQL instance (e.g., on Render, Neon, or Railway) and copy the `DATABASE_URL`.
2. **Environment Variables**:
   Set `NODE_ENV=production`, `DATABASE_URL`, `DB_SSL=true`, `JWT_SECRET`, `STRIPE_API_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET`.
3. **Build Command**:
   ```bash
   npm install && npm run build --prefix frontend
   ```
4. **Start Command**:
   ```bash
   npm start
   ```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Healthcheck & system status | Public |
| `GET` | `/api-docs` | Interactive Swagger API documentation | Public |
| `POST` | `/api/v1/register` | Register new user account | Public |
| `POST` | `/api/v1/login` | Authenticate & issue HttpOnly JWT | Public |
| `GET` | `/api/v1/logout` | Clear authentication cookie | Logged In |
| `GET` | `/api/v1/products` | Retrieve catalog with filters & pagination | Public |
| `GET` | `/api/v1/product/:id` | Get product details, SKUs & shades | Public |
| `POST` | `/api/v1/order/new` | Atomic ACID checkout & stock decrement | Logged In |
| `GET` | `/api/v1/orders/me` | Logged-in user's order history | Logged In |
| `POST` | `/api/v1/coupon/validate`| Validate promo coupon & compute discount | Public |
| `POST` | `/api/v1/stripe/webhook` | Stripe cryptographic webhook reconciliation | Public / Stripe |
| `GET` | `/api/v1/wishlist` | Retrieve saved user wishlist | Logged In |
| `POST` | `/api/v1/wishlist/toggle`| Add/remove product from wishlist | Logged In |

---

## 📂 Project Structure

```
LuxeBeauty/
├── backend/
│   ├── config/              # PostgreSQL Sequelize connection & environment configs
│   ├── controllers/         # Thin controllers (auth, products, orders, coupons, webhooks)
│   ├── docs/                # OpenAPI 3.0 Swagger specification
│   ├── middleware/          # JWT auth guards, RBAC role authorization, error handlers
│   ├── models/              # Sequelize models (User, Product, Order, Coupon, Wishlist)
│   ├── routes/              # Express API route declarations
│   ├── services/            # Business service layer (OrderService, ProductService)
│   ├── tests/               # Automated Jest & Supertest integration test suites
│   ├── utils/               # JWT token dispatchers, caching layer, database seeders
│   ├── app.js               # Express application initialization & middleware stack
│   └── server.js            # Node HTTP server bootstrap
├── frontend/
│   ├── src/
│   │   ├── actions/         # Redux action creators (products, cart, wishlist, orders)
│   │   ├── component/       # React components (Home, ProductDetails, Cart, Dashboards)
│   │   ├── constants/       # Redux action types
│   │   ├── reducers/        # Redux state reducers
│   │   ├── store.js         # Central Redux store configuration
│   │   ├── App.js           # Route definitions & protected route guards
│   │   └── index.js         # React root mounting
│   └── package.json
├── .github/workflows/ci.yml # Automated GitHub Actions CI/CD test & build pipeline
├── Dockerfile               # Production multi-stage Docker build
├── docker-compose.yml       # Multi-container orchestration (PostgreSQL, Redis, App)
├── package.json             # Root backend dependencies & scripts
└── README.md
```

---

## 📄 License

This repository is proprietary software. All rights reserved.
`"private": true`, `"license": "UNLICENSED"`.
