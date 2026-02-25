# CLAUDE.md — Multi-Tenant SaaS Boilerplate (Appointment Booking)

> This file is the single source of truth for Claude (or any AI assistant) working on this codebase.
> It describes the project architecture, conventions, database schema, and how every major system works.
> Always read this file before making any changes.

---

## 📌 Project Overview

**What it is:** A production-ready, multi-tenant SaaS boilerplate built with Next.js 14, Supabase, and Stripe.
**Use case on top:** Appointment Booking — organizations can onboard, set up services, manage availability, and let clients book appointments via a public booking page.
**Goal:** Reusable across client projects. Sell as a service (custom builds) or as a template product.

---

## 🧱 Tech Stack

| Layer           | Technology                           |
| --------------- | ------------------------------------ |
| Framework       | Next.js 14 (App Router, TypeScript)  |
| Database        | Supabase (PostgreSQL)                |
| Auth            | Supabase Auth (Email + Google OAuth) |
| ORM / Queries   | Supabase JS Client (`@supabase/ssr`) |
| Payments        | Stripe (Subscriptions + Webhooks)    |
| Styling         | Tailwind CSS + shadcn/ui             |
| Email           | Resend                               |
| Deployment      | Vercel                               |
| Package Manager | pnpm                                 |

---

## 🗂️ Folder Structure

```
/
├── app/
│   ├── (auth)/                    # Public auth pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/               # Protected routes (requires auth + org)
│   │   ├── layout.tsx             # Sidebar + top nav layout
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Overview stats
│   │   ├── appointments/
│   │   │   ├── page.tsx           # List + calendar view
│   │   │   └── [id]/page.tsx      # Appointment detail
│   │   ├── services/
│   │   │   └── page.tsx           # CRUD for services
│   │   ├── availability/
│   │   │   └── page.tsx           # Set working hours
│   │   ├── team/
│   │   │   └── page.tsx           # Invite + manage members
│   │   ├── settings/
│   │   │   └── page.tsx           # Org settings (name, logo, slug)
│   │   └── billing/
│   │       └── page.tsx           # Stripe subscription management
│   │
│   ├── book/
│   │   └── [slug]/
│   │       └── page.tsx           # Public booking page for clients
│   │
│   ├── api/
│   │   ├── webhooks/
│   │   │   └── stripe/
│   │   │       └── route.ts       # Stripe webhook handler
│   │   ├── invitations/
│   │   │   └── route.ts
│   │   └── bookings/
│   │       └── route.ts           # Public booking API
│   │
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Landing page
│
├── components/
│   ├── ui/                        # shadcn/ui base components
│   ├── dashboard/                 # Dashboard-specific components
│   │   ├── Sidebar.tsx
│   │   ├── TopNav.tsx
│   │   └── StatsCard.tsx
│   ├── appointments/
│   │   ├── AppointmentTable.tsx
│   │   └── CalendarView.tsx
│   ├── booking/
│   │   ├── BookingForm.tsx
│   │   └── ServiceSelector.tsx
│   └── billing/
│       └── PricingCard.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   ├── server.ts              # Server client (RSC + Route Handlers)
│   │   └── middleware.ts          # Session refresh
│   ├── stripe/
│   │   ├── client.ts              # Stripe instance
│   │   └── plans.ts               # Plan definitions and feature gates
│   ├── resend/
│   │   └── emails.ts              # Email templates and send functions
│   └── utils.ts                   # Shared helpers
│
├── hooks/
│   ├── useOrganization.ts         # Current org context
│   ├── useSubscription.ts         # Current plan + feature access
│   └── useUser.ts                 # Current user
│
├── types/
│   └── index.ts                   # Shared TypeScript types
│
├── middleware.ts                  # Auth + tenant guard (Next.js middleware)
├── supabase/
│   └── migrations/                # SQL migration files
├── .env.local                     # Environment variables (never commit)
└── CLAUDE.md                      # This file
```

---

## 🗄️ Database Schema

All tables include `org_id` for tenant isolation. Row Level Security (RLS) is enabled on every table.

### `organizations`
```sql
CREATE TABLE organizations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,           -- used in /book/[slug]
  logo_url            TEXT,
  timezone            TEXT DEFAULT 'UTC',
  stripe_customer_id  TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan                TEXT DEFAULT 'free',           -- 'free' | 'pro' | 'business'
  plan_status         TEXT DEFAULT 'active',         -- 'active' | 'past_due' | 'canceled'
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
```

### `users` (extends Supabase auth.users)
```sql
CREATE TABLE users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id      UUID REFERENCES organizations(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  role        TEXT DEFAULT 'member',   -- 'owner' | 'admin' | 'member'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### `invitations`
```sql
CREATE TABLE invitations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  role        TEXT DEFAULT 'member',
  token       TEXT UNIQUE NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### `services`
```sql
CREATE TABLE services (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  duration     INT NOT NULL,        -- in minutes
  price        DECIMAL(10,2),       -- null = free
  currency     TEXT DEFAULT 'usd',
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### `availability`
```sql
CREATE TABLE availability (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       UUID REFERENCES organizations(id) ON DELETE CASCADE,
  day_of_week  INT NOT NULL,        -- 0=Sun, 1=Mon, ..., 6=Sat
  start_time   TIME NOT NULL,       -- e.g. '09:00'
  end_time     TIME NOT NULL,       -- e.g. '17:00'
  is_active    BOOLEAN DEFAULT TRUE
);
```

### `appointments`
```sql
CREATE TABLE appointments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID REFERENCES organizations(id) ON DELETE CASCADE,
  service_id      UUID REFERENCES services(id),
  client_name     TEXT NOT NULL,
  client_email    TEXT NOT NULL,
  client_phone    TEXT,
  notes           TEXT,
  starts_at       TIMESTAMPTZ NOT NULL,
  ends_at         TIMESTAMPTZ NOT NULL,
  status          TEXT DEFAULT 'pending',  -- 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔐 Multi-Tenancy & Row Level Security

**Core concept:** Every organization is a tenant. RLS policies ensure a tenant can never read or write another tenant's data, even if the queries are wrong.

### How org_id gets into the JWT

After login, the user's `org_id` is stored in the JWT via a Supabase database function:

```sql
-- Function to add org_id to JWT claims
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event JSONB)
RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE
  claims JSONB;
  user_org_id UUID;
BEGIN
  SELECT org_id INTO user_org_id FROM public.users WHERE id = (event->>'user_id')::UUID;
  claims := event->'claims';
  claims := jsonb_set(claims, '{org_id}', to_jsonb(user_org_id));
  RETURN jsonb_set(event, '{claims}', claims);
END;
$$;
```

### Example RLS Policies

```sql
-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Appointments: org members can CRUD their own org's appointments
CREATE POLICY "org_isolation_appointments" ON appointments
  USING (org_id = (auth.jwt()->>'org_id')::UUID);

-- Services: same pattern
CREATE POLICY "org_isolation_services" ON services
  USING (org_id = (auth.jwt()->>'org_id')::UUID);

-- Public read for booking page (no auth needed)
CREATE POLICY "public_read_services" ON services
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "public_insert_appointments" ON appointments
  FOR INSERT WITH CHECK (TRUE);   -- booking page can create appointments
```

---

## 💳 Stripe Integration

### Plans

Defined in `lib/stripe/plans.ts`:

```typescript
export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    stripePriceId: null,
    limits: {
      appointments: 50,     // per month
      services: 3,
      teamMembers: 1,
    },
    features: ['Basic booking page', '3 services', '50 appointments/mo'],
  },
  pro: {
    name: 'Pro',
    price: 29,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID!,
    limits: {
      appointments: 500,
      services: 20,
      teamMembers: 5,
    },
    features: ['Custom branding', '20 services', '500 appointments/mo', 'Email notifications', '5 team members'],
  },
  business: {
    name: 'Business',
    price: 79,
    stripePriceId: process.env.STRIPE_BUSINESS_PRICE_ID!,
    limits: {
      appointments: Infinity,
      services: Infinity,
      teamMembers: Infinity,
    },
    features: ['Unlimited everything', 'Priority support', 'API access', 'Custom domain'],
  },
};
```

### Stripe Webhook Events Handled

Located in `app/api/webhooks/stripe/route.ts`:

| Event                           | Action                                 |
| ------------------------------- | -------------------------------------- |
| `checkout.session.completed`    | Activate subscription, update org plan |
| `invoice.payment_succeeded`     | Confirm plan is active                 |
| `invoice.payment_failed`        | Set plan_status to `past_due`          |
| `customer.subscription.deleted` | Downgrade org to `free`                |
| `customer.subscription.updated` | Sync plan changes                      |

### Webhook Handler Pattern

```typescript
// app/api/webhooks/stripe/route.ts
import { stripe } from '@/lib/stripe/client';
import { createSupabaseServiceClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  const supabase = createSupabaseServiceClient(); // bypasses RLS

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      await supabase
        .from('organizations')
        .update({ 
          plan: session.metadata?.plan,
          stripe_subscription_id: session.subscription as string,
          plan_status: 'active'
        })
        .eq('stripe_customer_id', session.customer);
      break;
    }
    // ... other cases
  }

  return new Response('OK', { status: 200 });
}
```

---

## 🔑 Authentication Flow

### Signup (creates user + organization)

1. User submits signup form (name, org name, email, password)
2. `supabase.auth.signUp()` creates the auth user
3. A database trigger fires on `auth.users` insert:
   - Creates a row in `public.organizations`
   - Creates a row in `public.users` with `role = 'owner'`
4. User is redirected to `/dashboard`

### Database Trigger for Signup

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  new_org_id UUID;
  org_slug TEXT;
BEGIN
  -- Generate slug from org name (passed via raw_user_meta_data)
  org_slug := lower(regexp_replace(NEW.raw_user_meta_data->>'org_name', '[^a-zA-Z0-9]', '-', 'g'));
  
  -- Create organization
  INSERT INTO public.organizations (name, slug)
  VALUES (NEW.raw_user_meta_data->>'org_name', org_slug)
  RETURNING id INTO new_org_id;
  
  -- Create user profile
  INSERT INTO public.users (id, org_id, full_name, role)
  VALUES (NEW.id, new_org_id, NEW.raw_user_meta_data->>'full_name', 'owner');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Login

1. `supabase.auth.signInWithPassword()` or OAuth
2. Middleware checks session on every protected route
3. If no session → redirect to `/login`

---

## 🛡️ Middleware (Auth + Tenant Guard)

```typescript
// middleware.ts
import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/', '/login', '/signup', '/forgot-password', '/book'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and book pages
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Refresh session and guard protected routes
  return await updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 📧 Email System (Resend)

All emails are in `lib/resend/emails.ts`. Emails sent:

| Trigger                | Email                                        |
| ---------------------- | -------------------------------------------- |
| New appointment booked | Confirmation to client + notification to org |
| Appointment confirmed  | Confirmation email to client                 |
| Appointment cancelled  | Cancellation notice to client                |
| Team invitation        | Invite email with magic link                 |
| Payment failed         | Billing warning to org owner                 |

### Email Function Pattern

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAppointmentConfirmation({
  clientEmail,
  clientName,
  serviceName,
  startsAt,
  orgName,
}: AppointmentConfirmationProps) {
  await resend.emails.send({
    from: 'bookings@yourdomain.com',
    to: clientEmail,
    subject: `Appointment Confirmed — ${orgName}`,
    html: `...`, // or use React Email component
  });
}
```

---

## 🌐 Public Booking Page

Route: `/book/[slug]`

This is a fully public, unauthenticated page. It:

1. Fetches the organization by `slug`
2. Shows their active services
3. Shows available time slots based on `availability` table (excluding already booked slots)
4. Accepts client details (name, email, phone, notes)
5. Submits to `POST /api/bookings`
6. Sends confirmation email

**No Supabase auth required** — uses the service role key only for writing new appointments via the API route.

---

## 🔧 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=         # Never expose to client

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
STRIPE_BUSINESS_PRICE_ID=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚦 Feature Gating by Plan

Use the `useSubscription` hook in the dashboard to check feature access:

```typescript
// hooks/useSubscription.ts
export function useSubscription() {
  const { organization } = useOrganization();
  const plan = PLANS[organization?.plan ?? 'free'];

  return {
    plan,
    canInviteMembers: (currentCount: number) => currentCount < plan.limits.teamMembers,
    canAddService: (currentCount: number) => currentCount < plan.limits.services,
    isProOrAbove: ['pro', 'business'].includes(organization?.plan ?? ''),
    isBusiness: organization?.plan === 'business',
  };
}
```

In UI components:
```tsx
const { canAddService } = useSubscription();

<Button 
  disabled={!canAddService(services.length)}
  title={!canAddService(services.length) ? 'Upgrade to add more services' : ''}
>
  Add Service
</Button>
```

---

## 🔄 Data Fetching Conventions

- **Server Components** — use `createSupabaseServerClient()` for initial page data
- **Client Components** — use `createSupabaseBrowserClient()` for interactive queries
- **Route Handlers** — use `createSupabaseServerClient()` (cookie-based) or service role for public APIs
- **Never** use the service role key in client components

```typescript
// Server Component example
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function AppointmentsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, services(name)')
    .order('starts_at', { ascending: true });

  return <AppointmentTable appointments={appointments ?? []} />;
}
```

---

## 📋 TypeScript Types

```typescript
// types/index.ts

export type Plan = 'free' | 'pro' | 'business';
export type OrgRole = 'owner' | 'admin' | 'member';
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  timezone: string;
  stripe_customer_id: string | null;
  plan: Plan;
  plan_status: string;
  created_at: string;
}

export interface User {
  id: string;
  org_id: string;
  full_name: string;
  avatar_url: string | null;
  role: OrgRole;
}

export interface Service {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number | null;
  currency: string;
  is_active: boolean;
}

export interface Appointment {
  id: string;
  org_id: string;
  service_id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  notes: string | null;
  starts_at: string;
  ends_at: string;
  status: AppointmentStatus;
  services?: Pick<Service, 'name' | 'duration'>;
}

export interface Availability {
  id: string;
  org_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}
```

---

## 🚀 Build Phases & Checklist

### Phase 1 — Foundation
- [ ] Next.js 14 + TypeScript + Tailwind + shadcn/ui setup
- [ ] Supabase project created, env vars set
- [ ] Auth: signup, login, logout, forgot password
- [ ] DB trigger: auto-create org + user on signup
- [ ] Middleware: session guard on dashboard routes
- [ ] JWT hook: inject org_id into token
- [ ] RLS policies on all tables

### Phase 2 — Stripe Billing
- [ ] Stripe products + prices created (Pro, Business)
- [ ] Checkout flow (redirect to Stripe)
- [ ] Webhook handler (all 5 events)
- [ ] Billing page with plan display + upgrade/manage buttons
- [ ] Feature gating with `useSubscription`

### Phase 3 — Core App (Appointment Booking)
- [ ] Services CRUD page
- [ ] Availability settings page
- [ ] Appointments list + calendar view
- [ ] Public booking page (`/book/[slug]`)
- [ ] Booking API route
- [ ] Slot availability calculation (exclude booked slots)
- [ ] Email: booking confirmation + org notification

### Phase 4 — Team & Polish
- [ ] Team page: invite by email, list members, change roles
- [ ] Invitation acceptance flow
- [ ] Org settings: name, slug, logo upload
- [ ] Dashboard overview stats
- [ ] Mobile responsive design
- [ ] Error handling + loading states throughout
- [ ] Deploy to Vercel + configure Stripe webhook URL

---

## ⚠️ Important Rules for Claude

1. **Always use RLS** — never bypass it with the service role key in dashboard routes. Only use service role in webhook handlers and the public booking API.
2. **org_id is sacred** — every insert to a tenant table must include the correct `org_id`. Never trust client-supplied `org_id` — always read it from the authenticated session.
3. **Feature gate before acting** — check plan limits before allowing creates (services, team members, etc.)
4. **Type everything** — no `any`. Use types from `types/index.ts`.
5. **Server Components first** — fetch data on the server where possible. Only use client components when interactivity is needed.
6. **Environment variables** — `SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_SECRET_KEY` must never be used in `'use client'` components or exposed to the browser.
7. **Slug uniqueness** — always validate slug uniqueness before org creation/update.
8. **Timezone awareness** — all times stored in UTC in the DB. Convert to org's timezone for display.

---

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "next": "14.x",
    "@supabase/ssr": "latest",
    "@supabase/supabase-js": "latest",
    "stripe": "latest",
    "@stripe/stripe-js": "latest",
    "resend": "latest",
    "tailwindcss": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "date-fns": "latest",
    "react-hook-form": "latest",
    "zod": "latest",
    "@hookform/resolvers": "latest",
    "lucide-react": "latest"
  }
}
```

---

*Last updated: February 2026 | Stack: Next.js 14 + Supabase + Stripe + Resend*