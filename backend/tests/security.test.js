const request = require("supertest");
const app = require("../app");

describe("Phase 3: Security & Rate Limiting Suite", () => {
  it("should return Helmet security headers on HTTP responses", async () => {
    const res = await request(app).get("/api/v1/products");

    expect(res.headers).toHaveProperty("x-dns-prefetch-control");
    expect(res.headers).toHaveProperty("x-frame-options");
    expect(res.headers).toHaveProperty("x-download-options");
    expect(res.headers).toHaveProperty("x-content-type-options", "nosniff");
  });

  it("should have rate limit headers on general api routes", async () => {
    const res = await request(app).get("/api/v1/products");

    expect(res.headers).toHaveProperty("ratelimit-limit");
    expect(res.headers).toHaveProperty("ratelimit-remaining");
  });

  it("should reject invalid login credentials with standard 401 error response", async () => {
    const res = await request(app)
      .post("/api/v1/login")
      .send({ email: "nonexistent_test_user@example.com", password: "WrongPassword123" });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
