# Multi-Tenant SaaS Notes Application

> A comprehensive, multi-tenant SaaS Notes application featuring secure tenant isolation, JWT authentication, subscription gating, a full CRUD API, and a responsive React frontend.

## 🎯 Key Features

*   🏢 **Multi-Tenant Architecture:** Securely serves multiple tenants (e.g., Acme, Globex) from a single application instance.
*   🔐 **JWT Authentication:** Role-based access control (Admin/Member) with secure JSON Web Tokens.
*   💳 **Subscription Gating:** Differentiates features between "Free" and "Pro" plans, with an upgrade path.
*   ✍️ **Full CRUD API:** A complete and protected set of endpoints for managing notes.
*   🛡️ **Enhanced Security:** Includes rate limiting, security headers via Helmet.js, and strict CORS policy.
*   ⚛️ **React Frontend:** A responsive and user-friendly interface built with React + Vite.

## ✅ Core Functionality Breakdown

### Multi-Tenancy Architecture
*   **Approach:** Implemented a shared schema with a `tenantId` on relevant tables to logically separate data.
*   **Tenants:** The application is pre-seeded with two tenants: **Acme** and **Globex**.
*   **Isolation:** A robust middleware layer ensures that all database queries are strictly scoped to the authenticated user's tenant.
*   **Security:** Cross-tenant data access is impossible by design.

---

### Authentication & Authorization
*   JWT-based authentication with a **24-hour token expiration**.
*   Role-based access controls for Admin and Member users.

#### Test Accounts
Use the following accounts for testing. The password for all accounts is `password`.

| Email                 | Password   | Tenant | Role   |
| --------------------- | ---------- | ------ | ------ |
| `admin@acme.test`     | `password` | Acme   | Admin  |
| `user@acme.test`      | `password` | Acme   | Member |
| `admin@globex.test`   | `password` | Globex | Admin  |
| `user@globex.test`    | `password` | Globex | Member |

---

### Subscription Feature Gating
*   **Free Plan:** Limited to a maximum of **3 notes** per tenant.
*   **Pro Plan:** Allows for **unlimited notes**.
*   **Upgrade Endpoint:** Admins can upgrade a tenant via `POST /tenants/:slug/upgrade`.
*   **Real-time:** The note creation limit is removed immediately upon successful upgrade, without requiring a new login.

---

### Notes API (CRUD)
All endpoints are protected, tenant-aware, and respect user roles.

*   `POST /notes` – **Create Note:** Creates a new note for the current tenant.
*   `GET /notes` – **List Notes:** Retrieves all notes belonging to the current tenant.
*   `GET /notes/:id` – **Get Note:** Fetches a single note by its ID, ensuring it belongs to the tenant.
*   `PUT /notes/:id` – **Update Note:** Modifies an existing note.
*   `DELETE /notes/:id` – **Delete Note:** Removes a note.

---

### Additional Features & Security
*   **Health Check:** `GET /health` → `{"status": "ok"}`
*   **User Invites:** `POST /users/invite` (Admin only) to invite new members to a tenant.
*   **CORS:** Enabled to allow access from frontend applications and automated scripts.
*   **Rate Limiting:** Protects against brute-force attacks (100 requests per 15 minutes).
*   **Security Headers:** Uses **Helmet.js** to apply essential HTTP security headers.

---

### Frontend Interface
*   Built with **React + Vite** for a fast, modern user experience.
*   **Responsive Design:** Works seamlessly on desktop and mobile devices.
*   **Core Functionality:**
    *   Login form with tenant selection.
    *   Full notes management (create, view, edit, delete).
    *   An "Upgrade to Pro" button appears when the free plan's note limit is reached.
    *   Displays the tenant's current subscription status in real-time.
