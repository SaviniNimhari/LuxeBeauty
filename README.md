# LuxeBeauty — Luxury Cosmetics E-Commerce Platform

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-336791?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Sequelize](https://img.shields.io/badge/Sequelize-ORM-52B0E7?style=flat&logo=sequelize&logoColor=white)](https://sequelize.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-17+-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux-State%20Management-764ABC?style=flat&logo=redux&logoColor=white)](https://redux.js.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Payment%20Gateway-008CDD?style=flat&logo=stripe&logoColor=white)](https://stripe.com/)

A modern, full-stack cosmetics and beauty sanctuary built with **PostgreSQL**, **Sequelize**, **Express.js**, **React.js**, and **Node.js** (PERN stack). Features a luxury aesthetic, three-tier multi-role access (Customer, Seller, Admin), interactive business analytics, and an integrated order invoice receipt checkout system.

---

## 📑 Table of Contents

1. [Key Features](#-key-features)
2. [Multi-Role Architecture & Dashboards](#-multi-role-architecture--dashboards)
3. [Checkout & Invoice Receipt System](#-checkout--invoice-receipt-system)
4. [Demo Credentials & Quick Login](#-demo-credentials--quick-login)
5. [Tech Stack](#-tech-stack)
6. [Prerequisites](#-prerequisites)
7. [Installation & Setup](#-installation--setup)
8. [Database Seeding](#-database-seeding)
9. [Running the Application](#-running-the-application)
10. [REST API Reference](#-rest-api-reference)
11. [Project Structure](#-project-structure)
12. [Troubleshooting & FAQ](#-troubleshooting--faq)
13. [License & Copyright](#-license--copyright)

---

## ✨ Key Features

- **🛍️ 3-Tier Multi-Role Architecture**: Independent dashboards and permissions for **Customers**, **Sellers**, and **Admins**.
- **🧾 Integrated Invoice Receipt Checkout (`/process/payment`)**:
  - Live generated order receipt with receipt number, customer details, delivery address, itemized products, GST tax, and shipping calculation.
  - One-click **Print Receipt / PDF Export** button with dedicated `@media print` styling.
- **💳 Secure Payment Processing**: Stripe Card Elements integration with local sandbox/demo fallback for instant testing.
- **⚡ One-Click Demo Logins**: Pre-populated demo switcher on `/login` to test all three user tiers without manual entry.
- **📊 Business Analytics & Data Visualization**:
  - Store gross revenue line charts and inventory stock health doughnut charts powered by Chart.js.
  - Demographic distribution of registered users (Customers vs. Sellers vs. Admins).
- **💄 Luxury Beauty Catalog**: Search, filter by category/price/rating, verified customer reviews, and stock alerts.

---

## 👥 Multi-Role Architecture & Dashboards

```
                               ┌─── Customer Portal (/dashboard)
                               │
[LuxeBeauty Authentication] ───┼─── Seller Portal   (/seller/dashboard)
                               │
                               └─── Admin Control   (/admin/dashboard)
```

### 1. Customer Member Portal (`/dashboard`)
- **VIP Welcome Banner**: Displays membership tier and personalized greeting.
- **Quick Metrics**: Total Orders placed, items in shopping bag, and membership tenure.
- **Order History**: Real-time status tags (`Delivered`, `Processing`), date, price, and direct link to order details.
- **Quick Actions**: Shortcuts to view orders, bag, update profile, and change password.

### 2. Seller Merchant Operations Hub (`/seller/dashboard`)
- **Verified Merchant Banner**: Immediate access to add products and view the live public storefront.
- **KPI Metrics**: Total Gross Revenue, Active Products count, Orders Received, and Out-of-Stock warnings.
- **Interactive Visualizations**:
  - **Revenue Line Chart**: Real-time track of store sales.
  - **Inventory Health Doughnut Chart**: In-Stock vs. Out-of-Stock ratios.
- **Product Snapshot**: View recently added catalog items with stock badges and quick "Edit" links.
- **Orders Snapshot**: Review customer orders and process fulfillment.

### 3. Admin Master Control Panel (`/admin/dashboard`)
- **Platform Analytics**: Total revenue, products, orders, and total registered users.
- **User Demographics Breakdown**: Live count of registered **Customers**, **Sellers**, and **Admins**.
- **Catalog & Inventory Control**: Create, update, or remove any cosmetic product across the platform.
- **User Management**: View user details, change user roles, and delete accounts.
- **Reviews Moderation**: Inspect and moderate customer reviews and ratings.

---

## 🧾 Checkout & Invoice Receipt System

During checkout at `/process/payment`, customers are presented with a modern side-by-side view:

```
┌───────────────────────────────────────┬───────────────────────────────────────┐
│       OFFICIAL ORDER RECEIPT          │        CARD PAYMENT GATEWAY           │
│                                       │                                       │
│ • Receipt #: LXB-XXXXXX               │ • Accepted: Visa, Mastercard, Amex    │
│ • Date: Nov 8, 2026                   │ • Cardholder Name                     │
│ • Status: Awaiting Payment            │ • Card Number [•••• •••• •••• ••••]   │
│                                       │ • Expiry Date [MM / YY]               │
│ Billed To: Jane Doe (jane@email.com)  │ • CVV / CVC   [•••]                   │
│ Delivery Address: 123 Luxury Ave, CA  │                                       │
│                                       │ 💡 Test Card: 4242 •••• •••• 4242     │
│ Order Items:                          │                                       │
│  - Velvet Matte Rouge Lipstick x2     │ [ Pay Rs. 3,538 Now ]                 │
│  - Luminous Silk Foundation    x1     │                                       │
│                                       │ 🔒 256-Bit SSL Encrypted & PCI-DSS    │
│ Subtotal:   Rs. 2,998                 │                                       │
│ Shipping:   FREE (Over Rs. 1,000)     │                                       │
│ GST (18%):  Rs. 540                   │                                       │
│ Total Due:  Rs. 3,538                 │                                       │
│                                       │                                       │
│ [ 🖨️ Print Receipt ]                   │                                       │
└───────────────────────────────────────┴───────────────────────────────────────┘
```

- **Resilient Fallback**: If the page is accessed or refreshed directly, totals are automatically computed on the fly from the cart.
- **Print Optimization**: Clicking **Print Receipt** isolates the invoice and strips away navigation for clean paper or PDF printing.

---

## 🔑 Demo Credentials & Quick Login

Three pre-seeded accounts are available out of the box:

| Role | Email | Password | Allowed Access |
| :--- | :--- | :--- | :--- |
| **🛍️ Customer** | `customer@luxebeauty.com` | `Password123!` | `/dashboard`, `/orders`, `/cart`, `/account` |
| **💼 Seller** | `seller@luxebeauty.com` | `Password123!` | `/seller/dashboard`, `/admin/products`, `/admin/orders` |
| **👑 Admin** | `admin@luxebeauty.com` | `Password123!` | `/admin/dashboard`, `/admin/users`, `/admin/reviews`, all portals |

> **Quick Login UI:** On the [`/login`](http://localhost:3000/login) page, click any of the **Demo Credentials** buttons to instantly populate credentials and log in.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 17, Redux, Redux Thunk, React Router v5, Material-UI, Chart.js, react-chartjs-2 |
| **Backend** | Node.js, Express.js, Sequelize ORM, PostgreSQL (`pg`, `pg-hstore`) |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs, HTTP-only Cookie Parser |
| **Payments** | Stripe API, `@stripe/react-stripe-js`, `@stripe/stripe-js` |
| **Media / Storage** | Cloudinary SDK (product images & user avatars) |
| **Styling** | Custom CSS3, CSS Grid, Flexbox, Google Fonts (Inter & Playfair Display) |

---

## 📋 Prerequisites

- **Node.js** (v16.x or newer) and **npm**
- **PostgreSQL** (v12 or newer) installed locally or a cloud database URL (Neon, Supabase, Render, ElephantSQL)
- *(Optional)* Cloudinary account for media upload
- *(Optional)* Stripe account for live payment processing

---

## 🚀 Installation & Setup

### 1. Clone & Install Dependencies

From the project root:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Configure Environment Variables

Create your configuration file from the template:

```bash
# Windows PowerShell
Copy-Item backend\config\config.env.example backend\config\config.env

# Linux / macOS
cp backend/config/config.env.example backend/config/config.env
```

Update `backend/config/config.env` with your PostgreSQL database details:

```env
PORT=4000
DB_URI=postgres://postgres:password@127.0.0.1:5432/luxebeauty
DB_SSL=false
DB_SYNC_ALTER=false
DB_LOGGING=false

# Stripe Payment
STRIPE_API_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# JWT & Cookie
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=5d
COOKIE_EXPIRE=5

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Create the PostgreSQL database (if it does not already exist):
```sql
CREATE DATABASE luxebeauty;
```

---

## 💾 Database Seeding

Populate your database with demo users, cosmetic products, and customer reviews:

```bash
# 1. Seed demo accounts (Customer, Seller, Admin)
npm run seed:users

# 2. Seed makeup products & customer reviews
npm run seed

# 3. Or seed everything in a single command
npm run seed:all
```

---

## 💻 Running the Application

### Development Mode

Run the Express API backend with automatic restart:
```bash
npm run dev
```
*(Runs on `http://localhost:4000`)*

In a separate terminal, start the React frontend:
```bash
cd frontend
npm start
```
*(Runs on `http://localhost:3000`)*

### Production Build

Compile the React frontend:
```bash
npm run build --prefix frontend
```

Start the production server:
```bash
npm start
```
The Express backend will serve the REST API and the production build located in `frontend/build`.

---

## 📡 REST API Reference

### Authentication & Users (`/api/v1`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register new customer account | Public |
| `POST` | `/login` | Authenticate user & issue JWT cookie | Public |
| `GET` | `/logout` | Clear auth cookie | Logged In |
| `GET` | `/me` | Get currently logged-in user profile | Logged In |
| `PUT` | `/me/update` | Update user name & email | Logged In |
| `PUT` | `/password/update` | Change account password | Logged In |
| `GET` | `/admin/users` | Retrieve all registered users | Admin |
| `GET` | `/admin/user/:id` | Get details of a single user | Admin |
| `PUT` | `/admin/user/:id` | Update user role (admin/seller/user) | Admin |
| `DELETE` | `/admin/user/:id` | Delete user account | Admin |

### Products (`/api/v1`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/products` | Get products with search & pagination | Public |
| `GET` | `/product/:id` | Get single product details | Public |
| `GET` | `/admin/products` | Get all products for catalog management | Seller / Admin |
| `POST` | `/admin/product/new` | Create a new cosmetic product | Seller / Admin |
| `PUT` | `/admin/product/:id` | Update product details / stock | Seller / Admin |
| `DELETE` | `/admin/product/:id` | Delete a product | Seller / Admin |
| `PUT` | `/review` | Create or update customer review | Logged In |
| `GET` | `/reviews` | Get all reviews for a product | Public |
| `DELETE` | `/reviews` | Delete a product review | Admin |

### Orders & Payment (`/api/v1`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/order/new` | Create order after payment | Logged In |
| `GET` | `/orders/me` | Get logged-in user's orders | Logged In |
| `GET` | `/order/:id` | Get single order details | Logged In |
| `GET` | `/admin/orders` | View all customer orders | Seller / Admin |
| `PUT` | `/admin/order/:id` | Update order fulfillment status | Seller / Admin |
| `DELETE` | `/admin/order/:id` | Delete an order | Admin |
| `POST` | `/payment/process` | Initiate Stripe PaymentIntent | Logged In |
| `GET` | `/stripeapikey` | Retrieve Stripe public key | Logged In |

---

## 🗂️ Project Structure

```
LuxeBeauty/
├── backend/
│   ├── config/             # Database connection & env loader
│   ├── controllers/        # Order, Payment, Product, User business logic
│   ├── middleware/         # Auth, Role authorization, Async handlers, Errors
│   ├── models/             # Sequelize Models (User, Product, Order, Review)
│   ├── routes/             # Express API route endpoints
│   ├── utils/              # JWT, Emailer, API features, Seed scripts
│   └── server.js           # Main Express server entry point
│
├── frontend/
│   ├── public/             # Static public assets, index.html
│   └── src/
│       ├── actions/        # Redux action creators (Cart, Order, Product, User)
│       ├── component/
│       │   ├── Admin/      # Admin Dashboard, Products, Orders, Users, Reviews
│       │   ├── Cart/       # Cart, Shipping, ConfirmOrder, Payment (with Receipt)
│       │   ├── Home/       # Landing page, Banner, Featured products
│       │   ├── Order/      # MyOrders, OrderDetails
│       │   ├── Product/    # Product Details, Search, Filters
│       │   ├── Route/      # ProtectedRoute (Role-based access guard)
│       │   ├── Seller/     # Seller Dashboard & Merchant operations
│       │   ├── User/       # Customer Dashboard, Login/Register, Profile
│       │   └── layout/     # Header, Footer, Navigation, MetaData, Loaders
│       ├── constants/      # Redux action type constants
│       ├── reducers/       # Redux state reducers
│       ├── store.js        # Redux store configuration
│       └── App.js          # App routing and Providers
│
└── package.json            # Root configuration and seed scripts
```

---

## ❓ Troubleshooting & FAQ

1. **Database connection error (`connect ECONNREFUSED 127.0.0.1:5432`)**:
   - Ensure the PostgreSQL service is running on your system (`services.msc` on Windows or `sudo systemctl status postgresql` on Linux).
   - Verify that your credentials in `backend/config/config.env` match your local PostgreSQL setup.
2. **Missing demo accounts**:
   - Run `npm run seed:users` to re-seed or reset the demo Customer, Seller, and Admin credentials.
3. **Stripe payment in development mode**:
   - The payment gateway features a built-in sandbox fallback. If no live Stripe keys are provided, transactions complete successfully in test mode.

---

## 🔒 License & Copyright

Private & Proprietary. All rights reserved.
