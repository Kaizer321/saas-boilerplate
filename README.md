# BookIt — Multi-Tenant SaaS Appointment Booking Platform

A full-stack, multi-tenant appointment booking platform built with **Next.js 14**, **Supabase**, **Stripe**, and an **AI-powered booking assistant** (Gemini). Designed for businesses to manage services, team members, availability, and client bookings — all under one dashboard.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-green?logo=supabase)
![Stripe](https://img.shields.io/badge/Stripe-Billing-purple?logo=stripe)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)
![Gemini AI](https://img.shields.io/badge/Gemini-AI%20Chatbot-orange?logo=google)

---

## ✨ Features

### Dashboard
- 📊 **Overview stats** — appointments, services, team members at a glance
- 📱 **Fully responsive** — mobile sidebar with slide-in/out animation
- 🔐 **Auth** — Email/password & Google OAuth sign-in/signup

### Services Management
- ➕ **Add, edit, delete services** with name, description, duration, and price
- 🔀 **Toggle services** active/inactive with a single click
- 💳 **Free & paid services** supported

### Availability Scheduling
- 📅 **Set working hours** per day of the week (30-min increments)
- 🔘 **Toggle days** on/off (e.g., closed on weekends)
- 💾 **Save to database** — persists to Supabase instantly

### Public Booking Page
- 🌐 **Public URL** at `/book/[your-slug]` — share with clients
- 📋 **Lists real services** and working hours from your dashboard
- 🤖 **AI Booking Assistant** — floating chatbot powered by Gemini 2.0 Flash
- 💬 Clients can ask about services, pricing, and available times

### AI Booking Assistant
- 🧠 **Context-aware** — knows your services, prices, and availability
- 🗣️ **Conversational** — helps clients pick the right service and time
- ⚡ **Powered by Gemini 2.0 Flash** — fast, intelligent responses
- 🎨 **Beautiful chat UI** — animated bubble, typing indicators, message history

### Multi-Tenancy & Security
- 🏢 **Full data isolation** via Supabase Row Level Security (RLS)
- 👥 **Team roles** — Owner, Admin, Member
- 🔑 **SECURITY DEFINER function** prevents RLS recursion

### Billing (Stripe)
- 💰 **3 subscription tiers** — Free, Pro ($29/mo), Business ($79/mo)
- 🔄 **Webhook handling** for subscription lifecycle events
- 📈 **Usage-based gating** — limits on services, appointments, team members

---

## 🏗️ Tech Stack

| Layer        | Technology                                    |
| ------------ | --------------------------------------------- |
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling**  | Tailwind CSS 3.4, shadcn/ui design tokens     |
| **Database** | Supabase (PostgreSQL), Row Level Security     |
| **Auth**     | Supabase Auth (Email/Password + Google OAuth) |
| **Payments** | Stripe (Subscriptions + Webhooks)             |
| **AI**       | Google Gemini 2.0 Flash (Booking Assistant)   |
| **Email**    | Resend (Transactional notifications)          |
| **Hosting**  | Vercel                                        |

---

## 📁 Project Structure

```
app/
├── (auth)/                 # Login, Signup, Forgot Password
├── (dashboard)/            # Protected dashboard pages
│   ├── dashboard/          # Overview with stats
│   ├── appointments/       # Manage bookings
│   ├── services/           # CRUD services (add/edit/delete/toggle)
│   ├── availability/       # Weekly schedule (editable dropdowns)
│   ├── team/               # Invite & manage members
│   ├── settings/           # Org name, slug, timezone
│   └── billing/            # Subscription management
├── api/
│   ├── webhooks/stripe/    # Stripe event handler
│   ├── bookings/           # Public booking endpoint
│   ├── chat/               # AI chatbot endpoint (Gemini)
│   └── invitations/        # Team invite endpoint
├── auth/callback/          # OAuth code exchange
├── book/[slug]/            # Public booking page + AI chatbot
└── page.tsx                # Landing page

components/
├── booking/ChatWidget.tsx  # Floating AI chat bubble
└── dashboard/              # Sidebar, TopNav, StatsCard

hooks/                      # useOrganization, useSubscription, useUser
lib/
├── supabase/               # Browser, server, and middleware clients
├── stripe/                 # Stripe client + plan definitions
├── resend/                 # Email templates
└── utils.ts                # Shared helpers (cn, formatDate, generateSlug)
types/                      # TypeScript interfaces
supabase/migrations/        # SQL schema, RLS policies, triggers
```

---

## 🗄️ Database Schema

Six core tables with full RLS enforcement:

- **organizations** — Tenants with plan, slug, Stripe IDs
- **users** — Extends `auth.users` with org membership and role
- **services** — Bookable services with duration and pricing
- **availability** — Weekly working hours per org
- **appointments** — Client bookings with status tracking
- **invitations** — Team invite tokens with expiry

A database trigger automatically creates an organization and user profile on signup. A `SECURITY DEFINER` function (`get_user_org_id()`) powers all RLS policies without recursion.

---

## 💰 Subscription Plans

|                     | Free | Pro ($29/mo) | Business ($79/mo) |
| ------------------- | ---- | ------------ | ----------------- |
| Services            | 3    | 20           | Unlimited         |
| Appointments/mo     | 50   | 500          | Unlimited         |
| Team Members        | 1    | 5            | Unlimited         |
| Custom Branding     | —    | ✓            | ✓                 |
| Email Notifications | —    | ✓            | ✓                 |
| AI Booking Bot      | ✓    | ✓            | ✓                 |
| Priority Support    | —    | —            | ✓                 |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- [Supabase](https://supabase.com) account
- [Google AI Studio](https://aistudio.google.com) API key (for AI chatbot)
- [Stripe](https://stripe.com) account (optional — for billing)
- [Resend](https://resend.com) account (optional — for emails)

### 1. Clone & Install

```bash
git clone https://github.com/Kaizer321/saas-boilerplate.git
cd saas-boilerplate
npm install
```

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Fill in your keys:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (optional)
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Resend (optional)
RESEND_API_KEY=re_...

# Gemini AI (for booking chatbot)
GEMINI_API_KEY=your-gemini-api-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Supabase Database

Run these SQL files in your **Supabase Dashboard → SQL Editor**, in order:

1. `supabase/migrations/001_create_tables.sql` — Creates all tables and indexes
2. `supabase/migrations/003_functions_triggers.sql` — Signup trigger + helper functions
3. `supabase/migrations/004_fix_rls_policies.sql` — Row Level Security policies (uses `SECURITY DEFINER`)

> ⚠️ **Important:** Run `004_fix_rls_policies.sql` instead of `002_rls_policies.sql` — it fixes infinite recursion and uses a helper function.

### 4. Configure Supabase Auth

In your **Supabase Dashboard → Authentication → URL Configuration**:

- **Site URL:** `http://localhost:3000` (or your production URL)
- **Redirect URLs:** Add `http://localhost:3000/auth/callback`

For **Google OAuth** (optional):
1. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com)
2. Set authorized redirect URI to `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
3. Enable Google provider in **Supabase → Authentication → Providers**

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📱 Full Workflow

### For Business Owners (Dashboard)

1. **Sign up** at `/signup` with email or Google
2. **An organization is auto-created** with your name as the slug
3. **Add services** → Dashboard → Services → "Add Service"
   - Set name, description, duration (15–120 min), price
4. **Set availability** → Dashboard → Availability
   - Toggle days on/off, set start/end times, click "Save Changes"
5. **Share your booking link** → `https://your-domain.com/book/your-slug`
6. **Manage appointments** → Dashboard → Appointments
7. **Invite team members** → Dashboard → Team
8. **Upgrade plan** → Dashboard → Billing

### For Clients (Public Booking Page)

1. Visit the business's booking link (`/book/[slug]`)
2. Browse available **services** and **working hours**
3. Click the **💬 chat bubble** to talk to the AI assistant
4. Ask questions like:
   - *"What services do you offer?"*
   - *"How much does a consultation cost?"*
   - *"When are you available on Tuesday?"*
5. The AI responds with real data from the business's dashboard

---

## 🔌 API Routes

| Method | Endpoint               | Description                           |
| ------ | ---------------------- | ------------------------------------- |
| `POST` | `/api/chat`            | AI chatbot (Gemini) — booking queries |
| `POST` | `/api/webhooks/stripe` | Handles Stripe subscription events    |
| `POST` | `/api/bookings`        | Creates appointments (public)         |
| `POST` | `/api/invitations`     | Sends team invitations                |
| `GET`  | `/auth/callback`       | OAuth code exchange (Google login)    |

---

## ☁️ Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Kaizer321/saas-boilerplate)

### Steps:

1. Import your GitHub repo on [Vercel](https://vercel.com)
2. Add **all environment variables** from `.env.local` in Vercel Settings
3. Set `NEXT_PUBLIC_APP_URL` to your Vercel production URL
4. Update **Supabase → Authentication → URL Configuration**:
   - **Site URL:** `https://your-app.vercel.app`
   - **Redirect URLs:** `https://your-app.vercel.app/auth/callback`
5. Deploy!

### Live Demo

🔗 [saas-boilerplate-five-jet.vercel.app](https://saas-boilerplate-five-jet.vercel.app)

---

## 📄 License

MIT
