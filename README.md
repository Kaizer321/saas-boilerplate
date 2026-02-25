# BookIt — Multi-Tenant SaaS Appointment Booking Platform

A full-stack, multi-tenant appointment booking platform built with Next.js 14, Supabase, and Stripe. Designed for businesses to manage services, team members, availability, and client bookings — all under one dashboard.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-green?logo=supabase)
![Stripe](https://img.shields.io/badge/Stripe-Billing-purple?logo=stripe)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)

## Overview

BookIt enables organizations to:

- **Create a business profile** with a public-facing booking page (`/book/[slug]`)
- **Define services** with pricing, duration, and descriptions
- **Set weekly availability** for each day of the week
- **Receive and manage appointments** from clients in a centralized dashboard
- **Invite team members** with role-based access (owner, admin, member)
- **Subscribe to plans** (Free → Pro → Business) with usage-based feature gating

Each organization operates in full data isolation via Supabase Row Level Security and JWT-based tenant identification.

## Tech Stack

| Layer        | Technology                                    |
| ------------ | --------------------------------------------- |
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling**  | Tailwind CSS 3.4, shadcn/ui design tokens     |
| **Database** | Supabase (PostgreSQL), Row Level Security     |
| **Auth**     | Supabase Auth (Email/Password + Google OAuth) |
| **Payments** | Stripe (Subscriptions + Webhooks)             |
| **Email**    | Resend (Transactional notifications)          |
| **Hosting**  | Vercel                                        |

## Project Structure

```
app/
├── (auth)/                 # Login, Signup, Forgot Password
├── (dashboard)/            # Protected dashboard pages
│   ├── dashboard/          # Overview with stats
│   ├── appointments/       # Manage bookings
│   ├── services/           # CRUD services
│   ├── availability/       # Weekly schedule
│   ├── team/               # Invite & manage members
│   ├── settings/           # Org name, slug, timezone
│   └── billing/            # Subscription management
├── api/
│   ├── webhooks/stripe/    # Stripe event handler
│   ├── bookings/           # Public booking endpoint
│   └── invitations/        # Team invite endpoint
├── auth/callback/          # OAuth code exchange
├── book/[slug]/            # Public booking page
└── page.tsx                # Landing page

components/dashboard/       # Sidebar, TopNav, StatsCard
hooks/                      # useOrganization, useSubscription, useUser
lib/
├── supabase/               # Browser, server, and middleware clients
├── stripe/                 # Stripe client + plan definitions
├── resend/                 # Email templates
└── utils.ts                # Shared helpers (cn, formatDate, generateSlug)
types/                      # TypeScript interfaces
supabase/migrations/        # SQL schema, RLS policies, triggers
```

## Database Schema

Six core tables with full RLS enforcement:

- **organizations** — Tenants with plan, slug, Stripe IDs
- **users** — Extends `auth.users` with org membership and role
- **services** — Bookable services with duration and pricing
- **availability** — Weekly working hours per org
- **appointments** — Client bookings with status tracking
- **invitations** — Team invite tokens with expiry

A database trigger automatically creates an organization and user profile on signup. A JWT hook injects `org_id` into access tokens to power RLS.

## Subscription Plans

|                     | Free | Pro ($29/mo) | Business ($79/mo) |
| ------------------- | ---- | ------------ | ----------------- |
| Services            | 3    | 20           | Unlimited         |
| Appointments/mo     | 50   | 500          | Unlimited         |
| Team Members        | 1    | 5            | Unlimited         |
| Custom Branding     | —    | ✓            | ✓                 |
| Email Notifications | —    | ✓            | ✓                 |
| Priority Support    | —    | —            | ✓                 |

## Getting Started

### Prerequisites

- Node.js 18+
- [Supabase](https://supabase.com) account
- [Stripe](https://stripe.com) account (optional — for billing)
- [Resend](https://resend.com) account (optional — for emails)

### Installation

```bash
git clone https://github.com/Kaizer321/saas-boilerplate.git
cd saas-boilerplate
npm install
```

### Configuration

```bash
cp .env.local.example .env.local
```

Fill in the environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

Run the SQL migration files in your Supabase SQL Editor, in order:

1. `supabase/migrations/001_create_tables.sql` — Creates all tables and indexes
2. `supabase/migrations/002_rls_policies.sql` — Enables Row Level Security
3. `supabase/migrations/003_functions_triggers.sql` — JWT hook + signup trigger

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Routes

| Method | Endpoint               | Description                        |
| ------ | ---------------------- | ---------------------------------- |
| `POST` | `/api/webhooks/stripe` | Handles Stripe subscription events |
| `POST` | `/api/bookings`        | Creates appointments (public)      |
| `POST` | `/api/invitations`     | Sends team invitations             |

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Kaizer321/saas-boilerplate)

Set the same environment variables in Vercel's project settings, and update the Supabase **Site URL** and **Redirect URLs** to match your production domain.

## License

MIT
