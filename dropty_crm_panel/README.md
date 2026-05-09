Dropty role-based CRM panel built with Next.js (App Router), TypeScript, and Tailwind.

## Features

- Login / logout via NextAuth (Credentials provider)
- Role-based access control (RBAC)
	- `admin`: all pages
	- `manager`: dashboard + customers
	- `agent`: dashboard only
- Dashboard layout with sidebar + topbar
- Customers page with dynamic table (TanStack Table: search + sort + pagination)
- Mock API endpoint: `/api/customers`

## Getting Started

### 1) Environment

Create `.env.local` (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Set `NEXTAUTH_SECRET` to any long random string.

Set `DROPTY_API_BASE_URL` to your external Node API (dropty_api_app) base URL.

### 2) Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Open http://localhost:3000

## Demo Accounts

Use these on the login screen:

- Admin: `admin@dropty.local` / `admin123`
- Manager: `manager@dropty.local` / `manager123`
- Agent: `agent@dropty.local` / `agent123`

## Routes

- `/login`
- `/dashboard`
- `/dashboard/customers` (admin/manager)
- `/dashboard/users` (admin)
- `/dashboard/settings`

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Notes

- RBAC is enforced in [src/middleware.ts](src/middleware.ts) and also server-side in the relevant pages.
- Demo users are hard-coded in [src/lib/auth.ts](src/lib/auth.ts). Replace with DB-backed auth when ready.
