const request = require("supertest");
const app = require("../app");

describe("Phase 5 & 6: Production Healthcheck & Swagger Docs Suite", () => {
  it("should return healthy status on /api/v1/health", async () => {
    const res = await request(app).get("/api/v1/health");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("healthy");
    expect(res.body).toHaveProperty("uptime");
    expect(res.body).toHaveProperty("timestamp");
  });

  it("should serve Swagger UI documentation at /api-docs/", async () => {
    const res = await request(app).get("/api-docs/");

    // Swagger UI either returns 200 (HTML page) or 301 redirect to /api-docs/
    expect([200, 301]).toContain(res.statusCode);
  });
});
