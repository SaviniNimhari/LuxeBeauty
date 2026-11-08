const express = require("express");
const router = express.Router();
const { handleStripeWebhook } = require("../controllers/webhookController");

// Mount webhook with express.raw middleware to preserve binary stream for signature verification
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

module.exports = router;
