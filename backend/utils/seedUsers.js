const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../config/config.env") });
const connectDatabase = require("../config/database");
const { User } = require("../models");
const bcrypt = require("bcryptjs");

const defaultUsers = [
  {
    name: "Demo Customer",
    email: "customer@luxebeauty.com",
    password: "Password123!",
    role: "user",
    avatar: {
      public_id: "avatars/customer_demo",
      url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    },
  },
  {
    name: "Demo Seller",
    email: "seller@luxebeauty.com",
    password: "Password123!",
    role: "seller",
    avatar: {
      public_id: "avatars/seller_demo",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    },
  },
  {
    name: "Demo Admin",
    email: "admin@luxebeauty.com",
    password: "Password123!",
    role: "admin",
    avatar: {
      public_id: "avatars/admin_demo",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    },
  },
];

async function seedUsers() {
  try {
    await connectDatabase();
    console.log("Database connected for seeding users...");

    for (const userData of defaultUsers) {
      const existing = await User.findOne({ where: { email: userData.email } });

      if (existing) {
        existing.name = userData.name;
        existing.role = userData.role;
        existing.avatar = userData.avatar;
        existing.password = userData.password; // hooks will hash on save
        await existing.save();
        console.log(`✓ Updated user: ${userData.email} (${userData.role})`);
      } else {
        await User.create(userData);
        console.log(`✓ Created user: ${userData.email} (${userData.role})`);
      }
    }

    console.log("\n=======================================================");
    console.log("✨ Demo Credentials Ready for Testing:");
    console.log("  1. Customer: customer@luxebeauty.com / Password123!");
    console.log("  2. Seller:   seller@luxebeauty.com   / Password123!");
    console.log("  3. Admin:    admin@luxebeauty.com    / Password123!");
    console.log("=======================================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
}

seedUsers();
