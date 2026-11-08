const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../config/config.env") });
const connectDatabase = require("../config/database");
const { Coupon } = require("../models");

const starterCoupons = [
  {
    code: "LUXE10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscount: 500,
    isActive: true,
  },
  {
    code: "WELCOME20",
    discountType: "percentage",
    discountValue: 20,
    minOrderAmount: 1500,
    maxDiscount: 1000,
    isActive: true,
  },
  {
    code: "FLAT500",
    discountType: "fixed",
    discountValue: 500,
    minOrderAmount: 2500,
    isActive: true,
  },
  {
    code: "GLOWVIP",
    discountType: "percentage",
    discountValue: 25,
    minOrderAmount: 3000,
    maxDiscount: 2000,
    isActive: true,
  },
];

async function seedCoupons() {
  try {
    await connectDatabase();
    console.log("Database connected for seeding coupons...");

    for (const c of starterCoupons) {
      const existing = await Coupon.findOne({ where: { code: c.code } });
      if (!existing) {
        await Coupon.create(c);
        console.log(`✓ Seeded coupon: ${c.code} (${c.discountType === "percentage" ? `${c.discountValue}%` : `Rs. ${c.discountValue}`})`);
      } else {
        console.log(`- Coupon ${c.code} already exists`);
      }
    }

    console.log("\n✨ Starter Coupons Ready for Testing: LUXE10, WELCOME20, FLAT500, GLOWVIP\n");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding coupons:", error);
    process.exit(1);
  }
}

seedCoupons();
