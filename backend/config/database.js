const { Sequelize } = require("sequelize");

// Make sure env vars are available even if this file is required first
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

// DATABASE_URL is what most hosts (Heroku, Render, Railway, Neon...) provide
const connectionString = process.env.DATABASE_URL || process.env.DB_URI;

if (!connectionString) {
  throw new Error(
    "Missing PostgreSQL connection string. Set DB_URI (or DATABASE_URL) in backend/config/config.env"
  );
}

const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  logging: process.env.DB_LOGGING === "true" ? console.log : false,
  dialectOptions:
    process.env.DB_SSL === "true"
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
  define: {
    underscored: true, // snake_case column names (created_at, user_id, ...)
  },
});

const connectDatabase = async () => {
  await sequelize.authenticate();

  // Load models + associations before syncing
  require("../models");

  // Creates missing tables. Set DB_SYNC_ALTER=true to let Sequelize
  // alter existing tables to match the models (development only).
  await sequelize.sync({ alter: process.env.DB_SYNC_ALTER === "true" });

  const { host, port, database } = sequelize.config;
  console.log(`PostgreSQL connected with server: ${host}:${port}/${database}`);
};

module.exports = connectDatabase;
module.exports.sequelize = sequelize;
