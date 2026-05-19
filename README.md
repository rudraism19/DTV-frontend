# Digital Twin Backend

Production-ready backend for digitaltwin.niat.tech with authentication, role-based access, PostgreSQL, file uploads, secure AI proxy, and deployment-ready configs.

## Tech Stack

- Node.js + Express 5
- PostgreSQL (pg)
- JWT auth + Google OAuth (ID token flow)
- Redis cache (optional)
- AWS S3 or local storage
- Swagger/OpenAPI, Winston logging

## Project Structure

```
src/
  app.js
  server.js
  config/
  controllers/
  db/
  middlewares/
  models/
  routes/
  services/
  utils/
migrations/
scripts/
tests/
public/
```

## Environment Setup

1. Copy env template and fill secrets:
   - `copy .env.example .env`
2. Update values in `.env` (DB, JWT secrets, OAuth, optional Redis/S3).

### Required variables

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

## Local Development

1. Install dependencies:
   - `npm install`
2. Start Postgres (or use Docker):
   - `docker-compose up -d db redis`
3. Run migrations:
   - `npm run db:migrate`
4. Start server:
   - `npm run dev`
5. Open:
   - `http://localhost:3000`

## API Documentation

- Swagger UI: `http://localhost:3000/api/docs`
- Health: `GET /api/v1/health`

## Authentication Flow

- Signup/Login returns access token + refresh token cookie.
- Access token used in `Authorization: Bearer <token>`.
- Refresh token rotated at `POST /api/v1/auth/refresh`.
- Google login expects a client-side ID token from Google Identity Services.

## File Uploads

- `POST /api/v1/files/upload` (multipart/form-data)
- Local storage uses `/uploads`, S3 uses configured bucket.
- Set `FILE_STORAGE=s3` plus AWS credentials to enable S3 storage.

## AI Proxy

- Legacy endpoint remains: `POST /api/messages`
- Versioned endpoint: `POST /api/v1/ai/messages`

## Deployment Guide

### Docker

1. Build and run:
   - `docker-compose up --build`
2. Apply migrations inside container:
   - `docker-compose exec api npm run db:migrate`
3. Compose overrides `DATABASE_URL` to use the `db` service hostname.

### Render / AWS / Vercel

1. Set environment variables from `.env.example`.
2. Provision Postgres and Redis (optional).
3. Run `npm run db:migrate` during release.
4. Start command: `npm start`.

## Testing Instructions

1. Create test DB (e.g. `digital_twin_test`).
2. Set `DATABASE_URL` for tests or leave default in `tests/env.setup.js`.
3. Run:
   - `npm test`

## Admin Bootstrapping

- Create or update admin user:
  - `ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=StrongPass!123 npm run db:seed-admin`
