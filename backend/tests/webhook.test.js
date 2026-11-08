const request = require("supertest");
const app = require("../app");
const { Order } = require("../models");

describe("Phase 3: Stripe Webhook & Payment Reconciliation Suite", () => {
  it("should process mock payment_intent.succeeded and return received: true", async () => {
    const mockEvent = {
      id: "evt_test_success_123",
      type: "payment_intent.succeeded",
      data: {
        object: {
          id: "pi_test_1234567890",
          amount: 299900,
          currency: "inr",
          status: "succeeded",
          metadata: {
            company: "LuxeBeauty",
          },
        },
      },
    };

    const res = await request(app)
      .post("/api/v1/stripe/webhook")
      .set("Content-Type", "application/json")
      .send(JSON.stringify(mockEvent));

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ received: true });
  });

  it("should handle payment_intent.payment_failed gracefully", async () => {
    const mockEvent = {
      id: "evt_test_failed_456",
      type: "payment_intent.payment_failed",
      data: {
        object: {
          id: "pi_test_failed_999",
          status: "requires_payment_method",
          last_payment_error: {
            message: "Your card was declined.",
          },
        },
      },
    };

    const res = await request(app)
      .post("/api/v1/stripe/webhook")
      .set("Content-Type", "application/json")
      .send(JSON.stringify(mockEvent));

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ received: true });
  });
});
