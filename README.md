# Sriram Kakumanu — Homepage V0

Next.js App Router, React, TypeScript, custom CSS. Read AGENTS.md and MASTER_BUILD_BRIEF.md before changes.

## Development

Use Node 24 and npm 11. From this checkout:

    npm ci
    npm run dev

## Validation

    npm run build
    npm run typecheck

## Content and scope

`content/site.ts` holds profile, project, experience, and archive content. `public/media` is reserved for approved personal images. Homepage navigation uses real section anchors; case-study routes and the full archive are future milestones, not dead links.

V0 uses conservative facts from the supplied master brief. Metrics, dates, phone, email, social profiles, portraits, and personal stories require verification or approval. Public GitHub profile is derived from the supplied repository owner. StudySense is linked as the product URL supplied by the owner; its external claims have not been verified. Project visuals are editorial typography, not product screenshots. Search indexing is disabled until the launch factual review. No analytics or tracking is installed.

## GitHub Pages preview

The workflow `.github/workflows/preview-pages.yml` builds a static export on pushes to `main` and deploys it with GitHub Actions. The repository Pages setting must use **GitHub Actions** as its source.

Reproduce the hosted build locally:

    PREVIEW_BASE_PATH=/PersonalPortfolio npm run build:preview

Only `out/` is uploaded to Pages. Source documents and repository files are not in that artifact. The homepage retains `noindex, nofollow`; this is a public preview, not access control. There is no custom-domain configuration. Expected URL after a successful deployment: `https://sriramk12.github.io/PersonalPortfolio/`.

## Interactive homepage prototype

The hero is an interactive field desk. `content/desk.ts` supplies both collections; `components/InteractiveDesk.tsx` handles object notes, bounded pointer dragging, arrow-key movement, and layout reset. Core profile and professional sections stay readable without JavaScript. Motion respects reduced-motion settings.

`components/DonationExperiment.tsx` is a explicitly hypothetical PlateConnect decision demonstration. It compares distance-first ordering with an urgency-first rule; it is not a production algorithm or evidence of project outcomes. Personal objects are illustrations, not owner photographs or travel records.

## Owner direction: minimal copy

Keep copy concise and factual. Avoid decorative taglines, conversational asides, repeated positioning statements, and explanations about missing media or future setup in the visitor experience. Preserve useful navigation labels and disclosures needed to understand a prototype. Interactive and visual elements remain part of the direction.
