# GearHub Client

A modern equipment-rental marketplace frontend built with Next.js. GearHub lets customers discover and rent equipment, owners manage listings and bookings, and administrators manage users, listings, and marketplace activity.

**Live application:** https://gear-hub-client-yken.vercel.app  
**Backend API:** https://gearhub-server.onrender.com

## Tech stack

- Next.js App Router `16.4.6`
- React `19.3.1` and TypeScript `7.0.2`
- Tailwind CSS v4
- Better Auth React client with JWT plugin
- TanStack Query
- Motion
- Recharts
- Lucide React
- Zod

## Features

### Marketplace

- Browse and search approved equipment listings
- Filter and sort equipment by marketplace criteria
- View equipment details, owner information, photos, and availability
- Compare equipment and explore nearby listings
- Create rental bookings with date, quantity, and contact information

### Customer experience

- Email/password registration and login
- Google sign-in when configured on the backend
- Customer dashboard and profile management
- Booking history and payment status
- Stripe-hosted checkout flow
- Favorites, reviews, notifications, and owner messaging
- Rental tracking and pickup/return information

### Owner experience

- Owner dashboard and analytics
- Create, edit, and manage equipment listings
- Submit listings for admin approval
- View rental bookings and manage eligible booking statuses
- Handle extension requests and rental handover workflows

### Admin experience

- Admin dashboard and platform analytics
- Search and manage registered users
- Change user roles and block/unblock accounts
- Review, approve, or reject equipment listings
- Monitor bookings and manage eligible refunds

## Requirements

- Node.js 20.9 or newer (Node.js 22 LTS recommended)
- npm 10 or newer
- The GearHub Express backend running locally or deployed
- MongoDB and Better Auth configured on the backend

## Getting started

1. Clone the repository:

   ```bash
   git clone <YOUR_CLIENT_REPOSITORY_URL>
   cd gearhub-client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local` in the project root:

   ```bash
   cp .env.example .env.local
   ```

   On Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env.local
   ```

4. Configure the environment variables (see below).

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|---|---:|---|
| `NEXT_PUBLIC_API_URL` | Yes | Express backend origin. Local: `http://localhost:5000`; production: `https://gearhub-server.onrender.com`. |
| `NEXT_PUBLIC_APP_URL` | Yes | Frontend origin. Local: `http://localhost:3000`; production: `https://gear-hub-client-yken.vercel.app`. |

### Local `.env.local` example

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production environment (Vercel)

Set these variables in the Vercel project settings:

```env
NEXT_PUBLIC_API_URL=https://gearhub-server.onrender.com
NEXT_PUBLIC_APP_URL=https://gear-hub-client-yken.vercel.app
```

Redeploy the frontend after changing environment variables. Never place Stripe secret keys, Better Auth secrets, MongoDB credentials, or Google client secrets in `NEXT_PUBLIC_*` variables.

## Authentication and API requests

Authentication is handled by Better Auth on the Express backend at `/api/auth/*`. The frontend uses the Better Auth React client and its JWT plugin.

- Email/password authentication and optional Google sign-in are provided by Better Auth.
- After authentication, protected API requests obtain a short-lived JWT and send it as `Authorization: Bearer <token>`.
- User roles and blocked status are read from the backend profile endpoint; the client does not decide its own permissions.
- The API helper sends requests to same-origin `/api/*` paths. The Next.js configuration rewrites those requests to the Express backend, helping keep authentication cookies first-party in the browser.
- Configure the backend `CLIENT_URL` and `CLIENT_URLS` with the exact frontend origin.

For Google OAuth, the backend callback is `/api/auth/callback/google`, and the frontend callback route is `/auth/callback`. Both the Google Cloud Console settings and backend environment must use the correct local or production origins.

## Main application routes

### Public routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/equipment` | Equipment search and discovery |
| `/equipment/[id]` | Equipment details and booking form |
| `/login` | Sign in |
| `/register` | Create an account |
| `/auth/callback` | Google OAuth callback handling |
| `/checkout/[bookingId]` | Booking summary and Stripe checkout redirect |
| `/payment/success` | Checks backend-confirmed payment status |
| `/payment/cancel` | Checkout cancellation result |

### Customer dashboard

| Route | Description |
|---|---|
| `/dashboard` | Customer overview |
| `/dashboard/rentals` | Rental history and status |
| `/dashboard/favorites` | Saved equipment |
| `/dashboard/profile` | Profile settings |
| `/dashboard/messages` | Conversations and messages |
| `/dashboard/notifications` | Notifications |
| `/dashboard/nearby` | Nearby equipment discovery |
| `/dashboard/tracking/[id]` | Rental tracking details |
| `/dashboard/compare` | Equipment comparison |
| `/dashboard/availability` | Availability tools |

### Owner dashboard

| Route | Description |
|---|---|
| `/dashboard/owner` | Owner overview and analytics |
| `/dashboard/owner/equipment` | Manage equipment listings |
| `/dashboard/owner/add-equipment` | Add a listing |
| `/dashboard/owner/bookings` | Manage rental bookings |

### Admin dashboard

| Route | Description |
|---|---|
| `/dashboard/admin` | Admin overview |
| `/dashboard/admin/users` | User and role management |
| `/dashboard/admin/equipment` | Equipment moderation |
| `/dashboard/admin/bookings` | Booking management |

## Stripe payment flow

GearHub uses Stripe-hosted Checkout. The frontend does not collect or store card details and does not mark bookings as paid itself.

1. The customer submits a booking. The backend calculates and stores the rental total.
2. The client requests a Checkout Session from `POST /api/payments/checkout/:bookingId`.
3. The browser redirects to the Stripe-hosted Checkout page.
4. Stripe sends a signed event to the backend webhook at `/api/payments/webhook`.
5. The backend verifies the event and updates payment and booking records.
6. The `/payment/success` page checks the backend payment status. A successful redirect alone is not proof of payment.

For local or assignment testing, use Stripe Test mode and the webhook configured on the backend. Do not use real card details in test instructions or commit Stripe credentials.

## Build and quality checks

```bash
npm run typecheck
npm run lint
npm run build
```

Run these commands before deploying. The exact scripts are defined in `package.json`.

## Deployment (Vercel)

1. Import the client repository into Vercel.
2. Set the production environment variables listed above.
3. Ensure the backend CORS allow-list includes `https://gear-hub-client-yken.vercel.app`.
4. Ensure `NEXT_PUBLIC_API_URL` points to the deployed Render API.
5. Deploy and verify login, Google OAuth (if enabled), page refreshes, role-based dashboards, equipment search, booking creation, Stripe checkout, and webhook-confirmed payment status.

## Security notes

- Do not commit `.env.local` or any private credentials.
- Do not expose server-only secrets through `NEXT_PUBLIC_*` variables.
- Do not treat client-side redirects or toast messages as payment confirmation; read the backend's verified payment status.
- Protect admin and owner routes with backend authorization, not just frontend visibility checks.

## License

Add the license that applies to this project before distributing it publicly.
