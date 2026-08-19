# Trusted Hands — Local Services Marketplace (Production Milestone 3)

**Trusted Hands** is a complete, production-oriented full-stack local services marketplace connecting homeowners and clients with vetted, verified service professionals (electricians, master carpenters, deep cleaning specialists, painters, plumbers, appliance technicians, and local craftsmen).

---

## 🎨 Visual Identity & Brand System

The visual identity of Trusted Hands preserves the exact official brand system:

- **Primary Crimson Red (`#AE2448`)**: Primary actions, active states, important links, focus states.
- **Dark Secondary Burgundy (`#6E1A37`)**: Dark surfaces, strong headings, admin navigation accents.
- **Secondary Muted Seafoam (`#72BAA9`)**: Positive states, verified states, approved states, accents.
- **Light Surface Soft Mint (`#D5E7B5`)**: Light surfaces, highlights, supporting badges.
- **Deep Ink (`#17211D`)**: Primary typography & dark accents.
- **Charcoal (`#292E2B`)**: Body text.
- **Bone White (`#FBF9F4`)**: Cards, panels, elevated surfaces.
- **Mist (`#D9DED6`)**: Subtle borders and dividers.

---

## 🏗 Project Architecture & Admin Subsystems

```
Trusted Hands (M3)/
├── client/                      # React 18 + TypeScript + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/           # AdminLayout & AdminProtectedRoute
│   │   │   ├── booking/         # Booking Timeline, Cancellation & Review forms
│   │   │   ├── layout/          # Header, Footer, Container
│   │   │   └── ui/              # Button, Input, Select, Rating, Modal...
│   │   ├── context/             # AuthContext (JWT & Role session state)
│   │   ├── pages/
│   │   │   ├── admin/           # 18 Admin pages (Overview, Analytics, Customers,
│   │   │   │   │                # Providers, Pending Queue, Services, Categories,
│   │   │   │   │                # Bookings, Payments, Reviews, Notifications,
│   │   │   │   │                # CMS, Reports, Settings, Audit Logs)
│   │   │   │   └── cms/         # HomepageCMSPage, FaqCMSPage, AboutCMSPage
│   │   │   ├── auth/            # Login, Register, Forgot Password
│   │   │   ├── booking/         # Customer Booking Flow & Confirmation
│   │   │   └── public/          # Home, Services, Category, Provider Profiles, About
│   │   ├── services/            # adminService & marketplaceService API clients
│   │   └── types/               # Full TypeScript interfaces & Admin types
│   ├── index.html
│   └── vite.config.ts
│
└── server/                      # Node.js + Express + TypeScript + MongoDB Backend
    ├── src/
    │   ├── config/              # DB connection, Env validation, Admin seeding
    │   ├── controllers/         # adminController, authController, bookingController,
    │   │                        # paymentController, providerController, reviewController, healthController
    │   ├── middleware/          # JWT Auth & requireRole('ADMIN') server-side guards
    │   ├── models/              # User, Customer, Provider, Service, Category, Booking,
    │   │                        # Payment, Review, AuditLog, CMSSection, PlatformSetting
    │   └── routes/              # Express API V1 routes (/api/v1/admin, /api/v1/health...)
    └── package.json
```

---

## 🛠 Admin Operational Control Center Features

1. **Server-Side Admin Role Enforcement**: JWT authentication + `requireRole('ADMIN')` guard on all `/api/v1/admin/*` routes.
2. **Operational Overview & Today's Attention**: Actionable attention queue (Pending provider verifications, Disputed bookings, Failed payments, Flagged reviews) + Real DB platform snapshot.
3. **Platform Analytics & Date Filtering**: Date range selector (Today, 7D, 30D, 90D, YTD, Custom) with real DB aggregations (gross booking value, platform revenue, fulfillment & cancellation rates, category breakdown).
4. **Provider Verification Queue (`/admin/providers/pending`)**: Document inspector for government IDs, trade certificates, licenses, and background checks with audit-logged Approval, Rejection, and Change Request workflows.
5. **Customer & Provider Directory**: Server-side pagination, search by name/email/phone/ID, account status toggles (Active/Suspended), spend stats, and booking history.
6. **Service & Category Safety**: Service catalog management with category dependency safeguards before deactivation.
7. **Booking & Payment Interventions**: Administrative booking cancellation/completion, payment status tracking, and backend refund triggers.
8. **Review Moderation**: Rating filters, flag/hide/restore actions with stored audit logs.
9. **CMS & FAQ Management**: Structured editors for Homepage hero/trust copy, About narrative, and FAQ CRUD.
10. **Audit Logging & CSV Exports**: Comprehensive audit logs for every admin action (`AuditLog` model) and CSV exports for Customers, Providers, Bookings, Payments, and Reviews.

---

## 🚀 Environment Variables & Commands

### `.env` Setup (Server)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/trusted_hands
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@trustedhands.com
ADMIN_PASSWORD=AdminSecret123!
```

### Install Dependencies & Build
```bash
# Install all packages
npm run install:all

# Build Backend & Frontend for Production
npm run build

# Start Backend Server in Production Mode
cd server && npm start
```

### Health Check Endpoint
`GET /api/v1/health`
```json
{
  "status": "healthy",
  "service": "Trusted Hands API Engine",
  "environment": "production",
  "database": "connected",
  "timestamp": "2026-08-19T10:30:00.000Z"
}
```

---

## 🔐 Admin Setup Instructions

To log in as administrator:
1. Ensure `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in `server/.env`.
2. On server start, `seedInitialAdmin()` automatically seeds or elevates the admin user.
3. Navigate to `/auth/login`, enter credentials, and access the operational control center at `/admin`.
