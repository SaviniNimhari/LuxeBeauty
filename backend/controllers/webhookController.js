const { Order } = require("../models");

let stripe = null;
try {
  if (
    process.env.STRIPE_SECRET_KEY &&
    !process.env.STRIPE_SECRET_KEY.includes("your_stripe")
  ) {
    stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  }
} catch (e) {
  stripe = null;
}

/**
 * Stripe Webhook Handler
 * Verifies cryptographic signature and reconciles payment events in database
 */
exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (stripe && endpointSecret && sig) {
      // Production path: Verify cryptographic signature using raw request body
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      // Development / Testing fallback mode
      event = typeof req.body === "string" || Buffer.isBuffer(req.body)
        ? JSON.parse(req.body.toString())
        : req.body;
    }
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
    return res.status(400).json({
      success: false,
      message: `Webhook Error: ${err.message}`,
    });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      console.log(`💰 PaymentIntent succeeded: ${paymentIntent.id}`);

      // Reconcile order by payment ID or order ID in metadata
      const orderId = paymentIntent.metadata && paymentIntent.metadata.orderId;
      let order = null;

      if (orderId) {
        order = await Order.findByPk(orderId);
      }

      if (!order) {
        // Search by payment ID stored in paymentInfo JSONB
        const allOrders = await Order.findAll({ limit: 100, order: [["createdAt", "DESC"]] });
        order = allOrders.find(
          (o) => o.paymentInfo && o.paymentInfo.id === paymentIntent.id
        );
      }

      if (order) {
        order.paymentInfo = {
          id: paymentIntent.id,
          status: "succeeded",
          amount: paymentIntent.amount ? paymentIntent.amount / 100 : order.totalPrice,
          currency: paymentIntent.currency || "inr",
        };
        order.paidAt = new Date();
        if (order.orderStatus === "Payment Pending") {
          order.orderStatus = "Processing";
        }
        await order.save();
        console.log(`✅ Order ${order.id} payment verified & updated to succeeded.`);
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const failedIntent = event.data.object;
      console.warn(`❌ PaymentIntent failed: ${failedIntent.id}`);

      const orderId = failedIntent.metadata && failedIntent.metadata.orderId;
      let order = null;
      if (orderId) {
        order = await Order.findByPk(orderId);
      }
      if (order) {
        order.paymentInfo = {
          id: failedIntent.id,
          status: "failed",
          failureReason: failedIntent.last_payment_error
            ? failedIntent.last_payment_error.message
            : "Payment authorization failed",
        };
        await order.save();
      }
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object;
      console.log(`🔄 Charge refunded: ${charge.id}`);

      const allOrders = await Order.findAll({ limit: 100, order: [["createdAt", "DESC"]] });
      const order = allOrders.find(
        (o) => o.paymentInfo && (o.paymentInfo.id === charge.payment_intent || o.paymentInfo.chargeId === charge.id)
      );

      if (order) {
        order.orderStatus = "Refunded";
        order.paymentInfo = {
          ...order.paymentInfo,
          status: "refunded",
          refundedAt: new Date(),
        };
        await order.save();
      }
      break;
    }

    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }

  // Return 200 to acknowledge receipt of event
  res.status(200).json({ received: true });
};
