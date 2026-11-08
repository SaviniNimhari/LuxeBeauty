const request = require("supertest");
const app = require("../app");

describe("Phase 3: Coupon & Discount Validation Suite", () => {
  it("should validate percentage coupon LUXE10 correctly", async () => {
    const res = await request(app)
      .post("/api/v1/coupon/validate")
      .send({ code: "LUXE10", orderAmount: 5000 });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.coupon.discountAmount).toBe(500); // 10% of 5000
    expect(res.body.coupon.finalAmount).toBe(4500);
  });

  it("should validate flat coupon FLAT500 correctly", async () => {
    const res = await request(app)
      .post("/api/v1/coupon/validate")
      .send({ code: "FLAT500", orderAmount: 4000 });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.coupon.discountAmount).toBe(500);
    expect(res.body.coupon.finalAmount).toBe(3500);
  });

  it("should reject an invalid coupon code with 404", async () => {
    const res = await request(app)
      .post("/api/v1/coupon/validate")
      .send({ code: "INVALID_CODE_XYZ", orderAmount: 3000 });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
