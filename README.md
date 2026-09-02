# MedBlend — Website

Next.js 16 App Router. Serves two audiences from one codebase:

- **`app/*`** — the public landing page and legal pages
- **`app/api/*`** — the REST API for the mobile app *(not built yet)*

The mobile app lives in a separate repo: [medblendapp](https://github.com/mohammad01ahmad/medblendapp).

---

## Setup

```bash
git clone https://github.com/mohammad01ahmad/medblend-website.git
cd medblend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables are needed yet — the site is fully static and the waitlist is an external beehiiv embed. That changes when the API layer lands; see [Environment](#environment).

---

## Scripts

| Script | Does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build — also type-checks |
| `npm start` | Serve the production build locally |
| `npm run lint` | ESLint |

---

## Project Structure

`@/*` is aliased to the repo root (Next.js default — note this differs from the mobile app, where it points at `src/`).

```
app/                    App Router — routes only
  layout.tsx            Root layout: fonts, header, footer
  page.tsx              /
  globals.css           Tailwind v4 entry stylesheet
  contact/              /contact
  privacy-policy/       /privacy-policy
  FAQ/                  /FAQ
  waitlist/             /waitlist — beehiiv iframe embed
components/
  headers/              Header, StickyNav, ConditionalHeader
  homePage/             Landing page sections, one file per section
  ui/                   Vendored shadcn / magicui primitives
hooks/                  Reusable client hooks
lib/utils.ts            cn() — clsx + tailwind-merge
public/                 Static assets
```

**Routes are flat and lowercase.** Each folder under `app/` is a URL path — no route groups, no `legal/` parent. Static content is a `page.tsx`; `route.ts` is reserved for endpoints the mobile app calls.

**`components/ui/` is vendored.** Those files come from shadcn and magicui as-is and keep their kebab-case names — treat them as regenerable and avoid hand-editing. Components we write use PascalCase, which is how you tell the two apart at a glance. Add new primitives with the shadcn CLI (`components.json` is configured).

Full breakdown: [`ARCHITECTURE.md` §9](https://github.com/mohammad01ahmad/medblendapp/blob/main/docs/ARCHITECTURE.md) in the mobile repo, which holds the docs for both repos.

---

## Environment

Not needed today. When the API layer is built, `.env.example` will carry:

```
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only and must never take a `NEXT_PUBLIC_` prefix — that would ship it to the browser. See `docs/SECURITY.md` §3.6 and §5 in the mobile repo.

---

## Conventions

- Branch off `main`: `feature/short-description` or `fix/short-description`
- Open a PR into `main` — CI must pass before merge
- Route folders are lowercase and kebab-case; URLs are case-sensitive

CI (`.github/workflows/ci.yml`) installs and runs `npm run build`. The lint step exists but is commented out pending a cleanup pass.

---

## Deployment

Vercel, via the GitHub integration rather than Actions:

- `main` → production
- Pull requests → preview deployments
