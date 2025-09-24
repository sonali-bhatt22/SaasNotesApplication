# SaaS Notes Backend

## Multi-tenancy Approach
- Shared schema with `tenantId` (ObjectId) on `User` and `Note` documents.
- All queries are scoped by `tenantId` to enforce tenant isolation.

## Test Accounts (password: `password`)
- admin@acme.test (Admin)
- user@acme.test (Member)
- admin@globex.test (Admin)
- user@globex.test (Member)

## Endpoints
- GET `/health` → `{ "status": "ok" }`
- POST `/auth/login` → `{ token }`
- Notes (JWT required)
  - POST `/notes`
  - GET `/notes`
  - GET `/notes/:id`
  - PUT `/notes/:id`
  - DELETE `/notes/:id`
- Tenant
  - POST `/tenants/:slug/upgrade` (Admin only)

## Subscription Gating
- Free plan: `maxNotes = 3` enforced on note creation.
- Pro plan: unlimited immediately after upgrade.

## Environment Variables
- `MONGODB_URI`
- `JWT_SECRET`
- `PORT` (default 5000)

## Deploy on Vercel
- `vercel.json` is provided. Set Env Vars in Vercel Project Settings.
