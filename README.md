# Sriram Kakumanu — personal website

Next.js App Router, React, TypeScript, custom CSS, MapLibre GL, and Motion. Read the local owner-supplied AGENTS.md and MASTER_BUILD_BRIEF.md before changes. The owner's latest requests override earlier visual and homepage direction in those documents.

## Current owner direction

Dark design with Strava orange accents. The home page is a full-screen world map with a plane that flies to a chosen section; the headline under the name swaps sideways between titles. Section pages (Projects, Experience, Personal) are plain dark pages with an evenly spaced grid of flip cards: the front shows a name, and clicking flips it to the details. Profile is a single column. Mobile uses a bottom tab bar. All motion respects `prefers-reduced-motion`.

Inspired by Strava, not copied: Strava orange (`#fc4c02`) and layout patterns, but our own wordmark and icons, and never Strava's name or logo.

## Development

Node 24 and npm 11. From the repo root:

    npm ci --no-audit --no-fund
    npm run dev

`predev`, `prebuild`, and `prebuild:preview` copy MapLibre's worker module into `public/vendor/` (git-ignored); the map does not load without it.

## Validation

    npm run build
    npm run typecheck

## Routes and content

| Route | Page | Old URLs that redirect here |
| --- | --- | --- |
| `/` | Home: world map with a plane. Start, pick a destination, and the plane flies there and opens that section | |
| `/projects/` and `/projects/<id>/` | Projects: flip cards, each linking to a detail page | `/work/`, `/activities/<id>/`, `/projects/credit-card-advisor/` |
| `/experience/` | Experience: a flip card per role (company and role on the front; team, location and highlights on the back, no dates) | `/segments/` |
| `/personal/` | Personal: Runs, Hikes and Photos flip cards (totals and recent activities with route sketches; a photo grid with a full-screen viewer) | `/activities/`, `/routes/`, `/explore/` |
| `/profile/` | Profile: bio, contact (GitHub, email, LinkedIn), school, trophy case, gear, extracurriculars | `/about/`, `/contact/`, `/follow/` |

The home-page destinations (Projects → Austin, Experience → San Jose, Personal → Guatemala, Profile → Frisco) live in `destinations` in `content/site.ts`. The plane starts at Frisco and remembers where it last landed for the rest of the browser session.

Old URLs render a redirect page (meta refresh plus client redirect), because static hosting has no server redirects.

All copy lives in `content/site.ts`, sourced from the master brief and the owner's résumé. Fields marked `TODO` are placeholders; empty values are hidden on the site. Phone, email, and the résumé PDF are not published without owner approval.

Real Strava activities: `scripts/fetch-strava.mjs` runs before every dev server and build. It fetches recent activities with the `activity:read` scope (privacy zones already excluded), keeps only public ones with GPS, names every run by its local start time ("Morning Run" 4am–noon, "Afternoon Run" noon–3pm, "Evening Run" 3–8pm, "Night Run" 8pm–4am, with a rounded-down mileage prefix over 4 miles such as "5-mile Night Run") regardless of its Strava title; for other activities it undoes letters stretched for emphasis ("Zoneeee 2" → "Zone 2", "Goooood" → "Good", checked against `scripts/data/doubled-words.txt`, a list of real words with double letters from the macOS dictionary), replaces any name containing a blocked word (drinking, profanity, slang or low-effort titles; see `BLOCKED_WORDS`) with the same time-of-day name; names that are already clean are left as they are, trims 400 m off both ends of each route, and writes `content/strava.json` (git-ignored). The Personal page shows runs and hikes. Without credentials, or on any error, the Personal page simply shows no runs or hikes and the build still succeeds. Credentials (`STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_REFRESH_TOKEN`) live in GitHub Actions secrets and in `.env.local` (git-ignored); set or replace them with `npm run strava:auth`. The deploy workflow also runs daily at 12:00 UTC to pull new activities. Strava's API terms require "Powered by Strava" attribution wherever its data appears.

Map tiles come from OpenFreeMap (`positron` light, `dark` dark styles). No API key is required. Map data © OpenStreetMap contributors; the attribution control must stay visible.

Metrics come from the owner's résumé; phone, email, and unverified social accounts are omitted. Kudos are per-visitor (localStorage) and never show a fabricated count. No tracking is installed. Search indexing is on: `app/robots.ts` and `app/sitemap.ts` generate `robots.txt` and `sitemap.xml`, and redirect-only old URLs are marked noindex.

## GitHub Pages preview

`.github/workflows/preview-pages.yml` builds and deploys on pushes to main. Pages source is GitHub Actions. Reproduce the hosted build:

    npm run build:preview

Only `out/` is uploaded. `trailingSlash: true` generates route directories with index.html so direct links and refreshes work on Pages. The site is served at https://sriramkakumanu.com/ (custom domain set in the repo's Pages settings; DNS at GoDaddy points the apex at GitHub Pages' A records and `www` at `sriramk12.github.io`). Old `sriramk12.github.io/PersonalPortfolio/` links redirect there. `PREVIEW_BASE_PATH` is still supported for hosting under a subpath.
