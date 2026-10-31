# vangare.site

A marketplace that connects people who need device parts or repairs with
people who can supply them — built entirely on **Next.js** (App Router),
no separate backend service.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack by default) — UI + API
  in one codebase, via Route Handlers
- **React 19**
- **Prisma** + **PostgreSQL** (via Supabase) — data layer
- **NextAuth v4** — phone + password login, JWT sessions (see note below
  on why v4, not v5)
- **Tailwind CSS** — styled with the brand palette from the logo

### Requirements

- **Node.js 20.9 or newer** — required by Next.js 16
- **TypeScript 5.1+** (the project pins 5.6)

### Why NextAuth v4, not Auth.js v5

Auth.js v5 (the NextAuth rewrite) is still beta-tagged, and its own team
now points new projects toward a different library (Better Auth) rather
than v5. NextAuth v4 is still actively maintained and receiving security
patches, and — since this project doesn't use middleware/`proxy.ts` for
route protection (auth is checked per-route with `getServerSession`) — it
has no friction with Next.js 16. One caveat: NextAuth v4's package.json
declares React 17/18 as a peer dependency, so `npm install` may print a
peer-dependency warning on React 19. It's safe to ignore (NextAuth v4 only
uses React Context, which hasn't changed) — if `npm install` refuses
outright, rerun with `npm install --legacy-peer-deps`.

## What's included

- Homepage, listings browse/search, listing detail, post-ad form, login/register
- Listing model covering Buy / Sell / Offer Repair / Need Repair
- Browsing-history tracking (`UserEvent`) and interest scoring
  (`UserInterest`, `lib/interests.ts`) for the personalization + ad-targeting
  design in the product doc (section 14)
- An `Ad` table and matching endpoint (`/api/listings/:id/matches`) that
  surfaces opposite-type listings for the same part + model
- Photo upload on the post-ad form, using **Supabase Storage** directly
  from the browser

## What's stubbed / left for you to wire up

- **"Reveal phone number" / "Message seller" buttons** — currently static;
  wire the first to show `listing.user.phone` after a click (consider rate
  limiting), and the second to a real messaging flow.
- **Interest scoring job** — `recomputeUserInterests()` in `lib/interests.ts`
  is a function, not a cron job yet. Call it from a scheduled Route Handler
  (Vercel Cron) or trigger it after each event.
- **Homepage personalization & ad surfacing** — the homepage currently shows
  recent listings for everyone; swap in a query against `UserInterest` for
  logged-in users.
- **Repair technician directory** — the data model supports `REPAIR_OFFER`
  listings, but there's no dedicated `/repair` browse page yet — it reuses
  `/listings?type=REPAIR_OFFER`.

## Getting started (with Supabase)

1. Install dependencies:
   ```bash
   npm install
   ```
2. In your Supabase project dashboard, go to **Project Settings → Database**
   and copy two connection strings:
   - the **Transaction pooler** string (port `6543`) → `DATABASE_URL`
   - the **direct connection** string (port `5432`) → `DIRECT_URL`
     (migrations need this one; the pooler can't run them)
3. Go to **Project Settings → API** and copy the **Project URL** and
   **anon public key** → `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Copy `.env.example` to `.env` and fill in all four values above, plus a
   random `NEXTAUTH_SECRET` (generate one with `openssl rand -base64 32`).
5. In the Supabase dashboard, go to **Storage** and create a new bucket
   named exactly `listing-photos`. Set it to **Public** (so listing photos
   can be viewed without auth). The upload itself uses the anon key from
   the browser, so no extra policy is required for a quick start — for
   production, add a Storage policy that restricts uploads to
   authenticated users.
6. Push the schema to Supabase and generate the Prisma client:
   ```bash
   npx prisma migrate dev --name init
   ```
7. (Optional) Seed sample data:
   ```bash
   npm run seed
   ```
8. Run the dev server:
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000.

## Deploying

Push to GitHub and import the repo into Vercel. Add `DATABASE_URL`,
`DIRECT_URL`, `NEXTAUTH_URL` (your production URL), `NEXTAUTH_SECRET`,
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as
environment variables in the Vercel project settings, then point
`vangare.site`'s DNS at the Vercel project (Vercel's dashboard gives you the
exact A/CNAME records once you add the domain).

## Project structure

```
src/
  app/
    page.tsx                  Homepage
    listings/page.tsx         Browse & search
    listings/[id]/page.tsx    Listing detail
    post-ad/page.tsx          Create a listing
    login/, register/         Auth pages
    api/
      auth/[...nextauth]/     NextAuth handler
      auth/register/          Account creation
      listings/               List/search/create
      listings/[id]/          Detail/update/delete
      listings/[id]/matches/  Opposite-type matches
      events/                 View/search tracking
  components/                 Header, Footer, ListingCard, CategoryStrip, ViewLogger
  lib/
    prisma.ts                 Prisma client
    auth.ts                   NextAuth config
    interests.ts              Interest scoring
prisma/
  schema.prisma               Full data model
  seed.ts                     Sample data
```
