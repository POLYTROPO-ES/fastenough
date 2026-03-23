# Local Testing

## Unit tests
- Run once with coverage:
  `npm run test:run`
- Watch mode:
  `npm run test`

## E2E tests
1. Install browser once if needed:
   `npx playwright install chromium`
2. Run tests:
   `npm run test:e2e`

## Build check
- `npm run build`

## Docker
No Dockerfile is included in this baseline.
If needed, add one later with a static host or Cloudflare-focused runtime.
