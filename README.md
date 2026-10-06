# Sriram Kakumanu — personal website

Next.js App Router, React, TypeScript, custom CSS. Read the local owner-supplied AGENTS.md and MASTER_BUILD_BRIEF.md before changes. The owner's latest requests override earlier visual and homepage direction in those documents.

## Current owner direction

Minimal black-and-purple design with modern sans-serif typography. Use separate pages reached by clicking navigation; keep the landing page to name, positioning, university, and links. No scrolling homepage combining all sections. No desk, scrapbook, ornamental taglines, ad libs, or placeholder explanations. Personal imagery and additional contact details require owner approval.

## Development

Node 24 and npm 11. From /workspace/PersonalPortfolio:

    npm ci --no-audit --no-fund --cache /tmp/portfolio-npm-cache
    npm run dev

Use the existing isolated checkout. Do not create a worktree unless explicitly requested. Stop your own server before reinstalling dependencies.

## Validation

    npm run build
    npm run typecheck

## Routes and content

Home `/`, Work `/work/`, Experience `/experience/`, Explore `/explore/`, About `/about/`, Contact `/contact/`, and project summaries `/projects/<id>/`. Shared navigation indicates the active route. Project and profile content lives in `content/site.ts`. Approved personal media belongs in `public/media/`; no personal photos have been supplied.

Current facts come from the supplied brief. Disputed project metrics, dates, ownership details, phone, email, and unverified social accounts are omitted. Full case studies and the photo archive remain future work. Source briefs remain local and are not included in the hosted artifact. No tracking is installed. Search indexing remains disabled pending a launch factual review.

## GitHub Pages preview

`.github/workflows/preview-pages.yml` builds and deploys on pushes to main. Pages source is GitHub Actions. Reproduce the hosted build:

    PREVIEW_BASE_PATH=/PersonalPortfolio npm run build:preview

Only `out/` is uploaded. `trailingSlash: true` generates route directories with index.html so direct links and refreshes work on Pages. Preview: https://sriramk12.github.io/PersonalPortfolio/ . No custom domain is configured. `noindex, nofollow` is not access control.
