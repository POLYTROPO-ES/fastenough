# Cloudflare Pages Deployment

## Prerequisites
- Cloudflare account
- A Pages project named `fastenough` (or update script accordingly)
- API token with Pages deployment permissions

## Local build
1. `npm install`
2. `npm run build`

## Deploy manually
1. `npm run cf:deploy`

## Deploy via GitHub Actions
1. Add repository secrets:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
2. Push to `main` branch.
3. Workflow `.github/workflows/deploy-cloudflare.yml` deploys `dist`.

## Notes
- Security headers come from `public/_headers`.
- SPA fallback routing comes from `public/_redirects`.
- Example endpoint available at `/api/health` through Pages Functions.
