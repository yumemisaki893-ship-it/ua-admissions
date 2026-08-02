# University of Antique — Student Information Management & Admission System

Official website and online admission portal for the University of Antique (Sibalom, Antique, Philippines). Applicants can register, complete a five-step admission wizard, upload requirements, pay the application fee online, and track their application status in real time. Administrators manage applications, update statuses, and generate PDF acceptance letters.

## Tech Stack

| Layer      | Technology                                                              |
| ---------- | ----------------------------------------------------------------------- |
| Framework  | Next.js 14 (App Router), React 18, TypeScript                          |
| Styling    | Tailwind CSS, shadcn/ui-style components, lucide-react icons           |
| Data       | PostgreSQL, Prisma ORM                                                 |
| Auth       | NextAuth.js v5 (beta) — credentials (bcrypt) + Google OAuth            |
| Payments   | PayMongo GCash / card checkout + webhook verification                  |
| Uploads    | Cloudinary (local `/public/uploads` fallback in dev)                   |
| Content    | TipTap (rich text) for CMS-managed site content                        |
| Other      | TanStack Query, Zod, Zustand, Upstash rate limiting, pdf-lib           |
| Testing    | Jest (unit) + Playwright (E2E)                                         |

## Requirements

- Node.js 20+
- npm 10+
- PostgreSQL 16 (via Docker Compose, or a managed instance)

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables and adjust as needed
cp .env.example .env

# 3. Start the database
docker compose up -d

# 4. Create the schema and generate the Prisma client
npx prisma db push

# 5. Seed colleges, courses, news, content, and the admin account
npm run db:seed

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seed admin

- Email: `admin@universityofantique.edu.ph` (configurable via `SEED_ADMIN_EMAIL`)
- Password: `Admin12345!` (configurable via `SEED_ADMIN_PASSWORD`)
- Sign in at `/login` and navigate to `/admin`

## Environment Variables

See `.env.example` for the full list with comments. Key points:

- **PayMongo** — set `PAYMONGO_SECRET_KEY` and `PAYMONGO_WEBHOOK_SECRET` for real checkout. If left blank, the app runs in **simulated payment mode** (redirects to `/api/paymongo/simulate`) so the admission flow can be tested end-to-end locally.
- **Cloudinary** — set credentials to upload documents to Cloudinary. If blank, files are stored locally under `public/uploads` (dev fallback).
- **Google OAuth** — optional; leave `GOOGLE_CLIENT_ID/SECRET` blank to disable Google Sign-In.
- **Upstash** — optional rate limiting; if blank, an in-memory limiter is used.
- `APPLICATION_FEE_PHP` — application fee charged through PayMongo (default `500`).

## Scripts

| Command                  | Description                                      |
| ------------------------ | ------------------------------------------------ |
| `npm run dev`            | Start the dev server                             |
| `npm run build`          | Production build                                 |
| `npm start`              | Serve the production build                       |
| `npm run lint`           | ESLint                                          |
| `npm run typecheck`      | TypeScript check (`tsc --noEmit`)               |
| `npm test`               | Jest unit tests                                  |
| `npm run test:e2e`       | Playwright E2E tests (needs DB + dev server)     |
| `npm run db:push`        | Push the Prisma schema to the database           |
| `npm run db:migrate`     | Create and apply migrations                      |
| `npm run db:seed`        | Seed the database                                |

## Application Flow

1. Applicant registers at `/register` and signs in.
2. Completes the 5-step wizard at `/portal/apply`:
   1. Personal information
   2. Course selection (college → program, with open slots)
   3. Requirements upload (PSA birth certificate, Form 137, 2×2 photo — validated 5 MB, PDF/PNG/JPG)
   4. Application fee payment (PayMongo; simulated in dev)
   5. Review & submit → generates a reference number (`UA-YYYY-#####`)
3. Status tracked at `/portal/dashboard` (Pending → Under Review → Accepted / Rejected). Accepted applicants can download their acceptance letter.

## Admin Flow

Admins (`role: "ADMIN"`) access `/admin`:

- Dashboard: enrollment stats and charts
- Applicants: filter by status/college, view details, upload verdict PDF, mark accepted/rejected
- Content: edit "About" blocks and manage news (TipTap rich text)

## Testing

**Unit tests** run without a database:

```bash
npm test
```

**E2E tests** (`e2e/admission.spec.ts`) cover the full admission journey and require the database running and seeded:

```bash
docker compose up -d
npx prisma db push
npm run db:seed
npm run test:e2e
```

Leave `PAYMONGO_SECRET_KEY` blank so the simulated payment route is active.

## Project Structure

```
prisma/
  schema.prisma          # User, StudentProfile, College, Course, Application,
                         # Document, Payment, News, SiteContent, ContactMessage
  seed.ts                # Colleges, courses, news, content, admin user
src/
  app/
    (site)/              # Public site: home, about, academics, news, contact, apply
    (auth)/              # login, register
    portal/              # Student portal: dashboard, apply wizard
    admin/               # Admin CMS: dashboard, applicants, content
    api/                 # auth, paymongo simulate/webhook, acceptance-letter PDF
  components/            # UI primitives + site/portal/admin components
  lib/                   # prisma, auth, validations, utils, paymongo, cloudinary, rate-limit
  middleware.ts          # Auth guards + rate limiting
  types/                 # next-auth type augmentation
```

## Deployment (Vercel)

1. Push the repo to GitHub and import into Vercel.
2. Add all env vars from `.env.example` (use a managed Postgres such as Neon/Supabase for `DATABASE_URL`).
3. Set `PAYMONGO_SECRET_KEY`, `PAYMONGO_WEBHOOK_SECRET`, Cloudinary, and Upstash keys for production.
4. Run `npx prisma db push` (or `prisma migrate deploy`) against the production database, then `npm run db:seed` once.
5. Configure the PayMongo webhook URL to `https://<your-domain>/api/paymongo/webhook`.

## Notes

- Route groups `(site)` and `(auth)` keep public pages at clean URLs; the portal and admin live at real `/portal` and `/admin` paths.
- Password hashing via bcrypt; rate limiting on auth endpoints and the contact form.
- Acceptance letters are generated server-side as PDFs with `pdf-lib` and can be re-downloaded from the applicant detail page.
