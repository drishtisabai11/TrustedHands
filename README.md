# Trusted Hands — Local Services Marketplace

**Trusted Hands** is a production-quality full-stack local services marketplace connecting discerning homeowners and clients with vetted, verified service professionals (electricians, master carpenters, deep cleaning specialists, painters, plumbers, appliance technicians, and local craftsmen).

---

## 🎨 Visual Identity & Design System

The visual identity of Trusted Hands combines **editorial publication design + modern digital product design + local human services**.

### Brand Palette
- **Deep Ink (`#17211D`)**: Primary headlines, navigation text, footers.
- **Forest Slate (`#34483F`)**: Dark surfaces & subtle hover states.
- **Mineral Green (`#657C6B`)**: Primary buttons, active states, verification badges.
- **Soft Sage (`#A9B8A8`)**: Supporting highlights & soft backgrounds.
- **Warm Clay (`#B8755B`)**: Selective warm accents (5% visual balance limit).
- **Parchment (`#F4F0E7`)**: Main background.
- **Bone (`#FBF9F4`)**: Cards, panels, elevated surfaces.
- **Charcoal (`#292E2B`)**: Body text.
- **Mist (`#D9DED6`)**: Subtle borders and dividers.

### Typography
- **Headings / Editorial**: `DM Serif Display`
- **Body / Interface**: `Manrope`

---

## 🏗 Project Architecture

```
Trusted Hands/
├── client/                      # React + TypeScript + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # 30+ Reusable UI components & primitives
│   │   │   └── layout/          # Header, Footer, Container layout components
│   │   ├── pages/
│   │   │   └── DesignSystemShowcase.tsx  # Interactive Component Explorer
│   │   ├── services/
│   │   │   └── api/             # Axios client with JWT interceptors
│   │   ├── styles/              # Global CSS & brand custom properties
│   │   └── types/               # Full TypeScript interfaces (User, Provider, Booking...)
│   ├── tailwind.config.js       # Strict design token mapping
│   └── vite.config.ts           # Dev server with proxy to backend
│
└── server/                      # Node.js + Express + TypeScript + MongoDB Backend
    ├── src/
    │   ├── config/              # Environment & MongoDB connection configs
    │   ├── controllers/         # Auth, Category, Provider, Booking controllers
    │   ├── middleware/          # JWT Auth & Role guards (CUSTOMER, PROVIDER, ADMIN)
    │   ├── models/              # Mongoose models (User, Provider, Customer, Booking...)
    │   └── routes/              # Express API V1 routes (/api/v1/auth, /api/v1/providers...)
    └── .env.example             # Environment configuration blueprint
```

---

## 🚀 Commands to Run

### Install Dependencies
```bash
# Install root dependencies
npm install

# Install client & server dependencies
npm run install:all
```

### Run Development Servers
```bash
# Option 1: Run both Client (5173) and Server (5000) concurrently
npm run dev

# Option 2: Run only Frontend Client
npm run dev:client

# Option 3: Run only Backend Server
npm run dev:server
```

### Build Production Bundles
```bash
npm run build
```

---

## 🔐 Key Features Configured (Foundation Phase)

1. **Strict Design Tokens**: Centralized Tailwind configuration, custom CSS variables, Google Fonts loading.
2. **30+ UI Components & Primitives**: Buttons, Inputs, Selects, Checkboxes, Radios, Toggles, Badges, Avatars, Rating Stars, Tabs, Modals, Drawers, Dropdowns, Tooltips, Toasts, Alerts, Skeletons, Price Displays, Date Selectors, Time Slots, Calendar primitives.
3. **Interactive Design System Showcase**: Available at `http://localhost:5173/` to inspect all design components and token systems.
4. **Backend REST API Structure**: Full v1 routing setup for `/api/v1/auth`, `/api/v1/providers`, `/api/v1/categories`, `/api/v1/bookings`, `/api/v1/payments`, `/api/v1/reviews`.
5. **Database Models**: Mongoose models for User, Customer, Provider, Category, Service, Booking, Payment, Review, Address, Availability, Notification, ProviderDocument, Transaction, Favorite, CMSPage, FAQ, SiteSetting.
6. **JWT Auth & Role Authorization**: Role guards for `CUSTOMER`, `PROVIDER`, and `ADMIN`.
