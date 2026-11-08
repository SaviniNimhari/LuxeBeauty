/**
 * LuxeBeauty - OpenAPI 3.0 Specification
 */
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "LuxeBeauty — Luxury Cosmetics E-Commerce API",
    version: "1.0.0",
    description:
      "Enterprise-grade PERN stack e-commerce REST API. Features 3-tier RBAC authentication (Customer, Seller, Admin), ACID transactional order processing, multi-variant cosmetic SKUs, Stripe webhook integration, and discount coupon validations.",
    contact: {
      name: "LuxeBeauty Engineering",
      email: "support@luxebeauty.com",
    },
  },
  servers: [
    {
      url: "http://localhost:4000/api/v1",
      description: "Local Development Server",
    },
  ],
  paths: {
    "/health": {
      get: {
        summary: "System Health & Status Check",
        tags: ["System Health"],
        responses: {
          200: {
            description: "System is healthy and responsive",
            content: {
              "application/json": {
                example: {
                  status: "healthy",
                  uptime: 142.5,
                  timestamp: "2026-11-08T14:00:00.000Z",
                  database: "connected",
                },
              },
            },
          },
        },
      },
    },
    "/products": {
      get: {
        summary: "Retrieve Products Catalog with Filtering & Pagination",
        tags: ["Products & Variants"],
        parameters: [
          { name: "keyword", in: "query", schema: { type: "string" }, description: "Search query" },
          { name: "category", in: "query", schema: { type: "string" }, description: "Filter by category" },
          { name: "price[gte]", in: "query", schema: { type: "number" }, description: "Minimum price" },
          { name: "price[lte]", in: "query", schema: { type: "number" }, description: "Maximum price" },
          { name: "ratings[gte]", in: "query", schema: { type: "number" }, description: "Minimum star rating" },
          { name: "page", in: "query", schema: { type: "integer" }, description: "Page number" },
        ],
        responses: {
          200: {
            description: "List of products matching filters",
          },
        },
      },
    },
    "/product/{id}": {
      get: {
        summary: "Get Detailed Product Information, SKUs & Variants",
        tags: ["Products & Variants"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Product details returned" },
          404: { description: "Product not found" },
        },
      },
    },
    "/login": {
      post: {
        summary: "Authenticate User & Issue JWT HttpOnly Cookie",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                email: "customer@luxebeauty.com",
                password: "Password123!",
              },
            },
          },
        },
        responses: {
          200: { description: "User successfully logged in with token cookie" },
          401: { description: "Invalid email or password" },
        },
      },
    },
    "/order/new": {
      post: {
        summary: "Create Order with Atomic Stock Decrement (Sequelize ACID Transaction)",
        tags: ["Orders & Transactions"],
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                shippingInfo: {
                  address: "123 Marine Drive",
                  city: "Mumbai",
                  state: "Maharashtra",
                  country: "India",
                  pinCode: 400020,
                  phoneNo: 9876543210,
                },
                orderItems: [
                  {
                    name: "Velvet Matte Rouge Lipstick (Ruby Rouge)",
                    price: 1499,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
                    product: "prod-uuid",
                    sku: "LX-LIP-001-RR",
                  },
                ],
                paymentInfo: {
                  id: "pi_mock_12345",
                  status: "succeeded",
                },
                itemsPrice: 1499,
                taxPrice: 270,
                shippingPrice: 0,
                totalPrice: 1769,
              },
            },
          },
        },
        responses: {
          201: { description: "Order created successfully" },
          400: { description: "Insufficient stock or invalid input" },
        },
      },
    },
    "/coupon/validate": {
      post: {
        summary: "Validate Promo Coupon & Compute Discount",
        tags: ["Coupons & Promotions"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                code: "LUXE10",
                orderAmount: 5000,
              },
            },
          },
        },
        responses: {
          200: { description: "Coupon is valid with computed discountAmount" },
          404: { description: "Invalid coupon code" },
        },
      },
    },
    "/stripe/webhook": {
      post: {
        summary: "Stripe Webhook Signature Verification & Payment Event Reconciliation",
        tags: ["Payments & Stripe"],
        responses: {
          200: { description: "Event received and processed" },
          400: { description: "Signature verification failed" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "token",
      },
    },
  },
};

module.exports = swaggerDocument;
