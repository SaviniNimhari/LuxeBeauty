const catchAsyncErrors = require("../middleware/catchAsyncErrors");

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

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  if (stripe) {
    try {
      const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "inr",
        metadata: {
          company: "LuxeBeauty",
        },
      });

      return res
        .status(200)
        .json({ success: true, client_secret: myPayment.client_secret });
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        return res.status(200).json({
          success: true,
          client_secret: "demo_secret_" + Date.now(),
          isDemo: true,
        });
      }
      throw err;
    }
  }

  res.status(200).json({
    success: true,
    client_secret: "demo_secret_" + Date.now(),
    isDemo: true,
  });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  const key =
    process.env.STRIPE_API_KEY &&
    !process.env.STRIPE_API_KEY.includes("your_stripe")
      ? process.env.STRIPE_API_KEY
      : "";

  res.status(200).json({ stripeApiKey: key });
});
