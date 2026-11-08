const request = require("supertest");
const app = require("../app");

describe("Phase 3: Product Catalog, SKUs & Variants Suite", () => {
  it("should retrieve products list with success: true", async () => {
    const res = await request(app).get("/api/v1/products");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  it("should contain SKU and variant fields on seeded products", async () => {
    const res = await request(app).get("/api/v1/products");

    expect(res.statusCode).toBe(200);
    const lipstick = res.body.products.find((p) => p.name.includes("Lipstick"));
    expect(lipstick).toBeDefined();
    expect(lipstick.sku).toBeDefined();
    expect(Array.isArray(lipstick.variants)).toBe(true);
    expect(lipstick.variants.length).toBeGreaterThan(0);
  });

  it("should filter products by category", async () => {
    const res = await request(app).get("/api/v1/products?category=Lipstick");

    expect(res.statusCode).toBe(200);
    expect(res.body.products.every((p) => p.category === "Lipstick")).toBe(true);
  });
});
