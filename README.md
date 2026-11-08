# LuxeBeauty

A full-stack LuxeBeauty application built with PostgreSQL, Express, React, and
Node.js. The Express backend exposes the API and serves the production React
build.

## Prerequisites

- Node.js and npm
- PostgreSQL 12+, either locally or through a hosted provider (Neon, Supabase,
  Render, Heroku Postgres, ...)
- A Stripe account for payments
- Cloudinary credentials for product images
- SMTP credentials for email notifications

## Installation

Install backend dependencies from the project root:

```powershell
npm install
```

Install frontend dependencies:

```powershell
Set-Location frontend
npm install
Set-Location ..
```

## Environment variables

Copy the example configuration:

```powershell
Copy-Item backend\config\config.env.example backend\config\config.env
```

Update `backend/config/config.env` with your own values. This file is ignored
by Git and must not be committed.

```env
PORT=4000
DB_URI=postgres://postgres:postgres@127.0.0.1:5432/luxebeauty
DB_SSL=false
DB_SYNC_ALTER=false
DB_LOGGING=false
STRIPE_API_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRE=5d
COOKIE_EXPIRE=5
SMPT_SERVICE=gmail
SMPT_MAIL=your_email@example.com
SMPT_PASSWORD=your_email_app_password
SMPT_HOST=smtp.gmail.com
SMPT_PORT=465
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Create the database before the first run (for example `createdb luxebeauty`).
Tables are created automatically on startup. Set `DB_SSL=true` for hosted
databases that require SSL. `DATABASE_URL` is also accepted instead of
`DB_URI`. `DB_SYNC_ALTER=true` lets Sequelize alter existing tables to match
the models (use only in development).

The application uses the variable name `SMPT_*` for email configuration for
compatibility with the existing backend code.

## Running the application

Start the backend:

```powershell
npm start
```

The server runs at `http://localhost:4000` when `PORT=4000` is configured.

For backend development with automatic restarts:

```powershell
npm run dev
```

To run the React frontend separately during development:

```powershell
Set-Location frontend
npm start
```

## Production build

Build the frontend from the project root:

```powershell
npm run build --prefix frontend
```

The backend serves the generated `frontend/build` directory.

## Troubleshooting

- If `express` or another package cannot be found, run `npm install` from the
  project root.
- If the PostgreSQL connection fails, check that PostgreSQL is running, that
  the database exists, and that `DB_URI` is correct.
- If the server reports an undefined port or database URI, make sure
  `backend/config/config.env` exists and contains `PORT` and `DB_URI`.
- Payment, email, image upload, and related features require valid service
  credentials.

## Learning resources

- [Node.js](https://youtu.be/BSO9C8Z-YV8)
- [React](https://youtu.be/99kgUCIMboY)
- [Express](https://youtu.be/teipbke8c4A)
- [PostgreSQL](https://www.postgresql.org/docs/current/tutorial.html)
- [Sequelize](https://sequelize.org/docs/v6/)
- [REST API](https://youtu.be/AhCSfuG9Jxw) (optional)

