# GitHub Actions and Cloudflare

## CI Workflow
File: `.github/workflows/ci.yml`

Checks on pull requests and pushes:
- Install dependencies
- Lint
- Typecheck
- Unit tests
- Playwright e2e tests
- Production build

## Deployment Workflow
File: `.github/workflows/deploy-cloudflare.yml`

Runs on pushes to `main`:
- Installs dependencies
- Builds app
- Deploys `dist` to Cloudflare Pages via Wrangler

## Required Secrets
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Recommendation
Keep deploy workflow gated by successful CI checks.
If needed, add a dependency between workflows or merge CI and deploy in one pipeline.
