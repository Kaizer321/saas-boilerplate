# BookIt — Multi-Tenant SaaS Appointment Booking Platform

A production-ready SaaS boilerplate for appointment booking, built with modern technologies.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-green?logo=supabase)
![Stripe](https://img.shields.io/badge/Stripe-Billing-purple?logo=stripe)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)

## Features

- **Multi-Tenant Architecture** — Organization-based data isolation with Row Level Security
- **Authentication** — Email/password + Google OAuth via Supabase Auth
- **Subscription Billing** — 3-tier pricing (Free/Pro/Business) with Stripe
- **Team Management** — Invite members with role-based access
- **Appointment Booking** — Service management, availability settings, conflict detection
- **Public Booking Pages** — Each org gets a shareable booking page at `/book/[slug]`
- **Email Notifications** — Powered by Resend
- **Responsive Dashboard** — Sidebar nav, stats overview, clean UI

## Tech Stack

| Technology   | Purpose                                       |
| ------------ | --------------------------------------------- |
| Next.js 14   | App Router, Server Components, API Routes     |
| TypeScript   | Type safety throughout                        |
| Supabase     | PostgreSQL database, Auth, Row Level Security |
| Stripe       | Subscription billing, webhooks                |
| Tailwind CSS | Styling with shadcn/ui design tokens          |
| Resend       | Transactional emails                          |
| Vercel       | Deployment                                    |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free)
- A [Stripe](https://stripe.com) account (free)
- A [Resend](https://resend.com) account (optional, for emails)

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/Kaizer321/saas-boilerplate.git
   cd saas-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Supabase URL, keys, Stripe keys, etc.

4. **Set up the database**
   Run the SQL files in `supabase/migrations/` in order:
   - `001_create_tables.sql`
   - `002_rls_policies.sql`
   - `003_functions_triggers.sql`

5. **Start the dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── (auth)/            # Login, Signup, Forgot Password
├── (dashboard)/       # Protected dashboard pages
├── api/               # API routes (webhooks, bookings, invitations)
├── auth/callback/     # OAuth callback handler
├── book/[slug]/       # Public booking page
├── layout.tsx         # Root layout
└── page.tsx           # Landing page

components/dashboard/  # Sidebar, TopNav, StatsCard
hooks/                 # useOrganization, useSubscription, useUser
lib/                   # Supabase, Stripe, Resend, utils
types/                 # TypeScript definitions
supabase/migrations/   # Database schema + RLS policies
```

## Subscription Plans

| Feature             | Free | Pro ($29/mo) | Business ($79/mo) |
| ------------------- | ---- | ------------ | ----------------- |
| Services            | 3    | 20           | Unlimited         |
| Appointments/mo     | 50   | 500          | Unlimited         |
| Team Members        | 1    | 5            | Unlimited         |
| Custom Branding     | ❌    | ✅            | ✅                 |
| Email Notifications | ❌    | ✅            | ✅                 |
| Priority Support    | ❌    | ❌            | ✅                 |

## Deployment

Deploy instantly on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Kaizer321/saas-boilerplate)

## License

MIT
