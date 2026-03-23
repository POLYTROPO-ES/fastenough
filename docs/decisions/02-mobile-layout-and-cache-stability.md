# 02 - Mobile Layout And Cache Stability

Date: 2026-03-23
Status: Accepted

## Context

The mobile UI had overlap issues between the speedometer legend, quick summary panel, and distance slider.
The top controls consumed too much vertical space on small screens.
Some revisits could load an empty app shell, likely due to stale service worker caches after deploys.

## Decision

1. Use a mobile-first compact layout constrained to the viewport.
2. Add a burger menu on mobile for secondary controls and information.
3. Keep primary driving controls visible in the main viewport while reducing visual density.
4. Move ring legend access into the mobile menu and hide floating legend on small screens.
5. Keep quick summary visible but compact and centered to avoid overlap with the distance slider.
6. Update service worker caching strategy from cache-first to network-first for navigations and runtime assets.

## Implementation Notes

- Header now has a menu trigger on small screens.
- Menu contains language selector, unit selector, share action, help panel, and legend summary.
- Mobile layout uses tighter spacing, reduced typography, and viewport-bound sizing.
- Speedometer scales down on small heights using responsive max-height rules.
- Service worker changes:
  - Cache version bumped to force old cache cleanup.
  - App shell precache excludes index/root HTML.
  - Navigations fetch with `cache: no-store` and fallback only when offline.
  - Runtime requests use network-first with cache fallback.

## Consequences

Positive:
- No overlap between legend and quick summary on mobile.
- Main controls fit better inside one viewport on most phones.
- Better resilience against stale cached HTML/asset mismatches after deployments.

Trade-offs:
- Reduced offline capability for first-load navigations due to network-first strategy.
- Mobile menu interaction adds one tap for less-frequently used controls.

## Follow-up

- If needed, add viewport-height based dynamic scaling in JavaScript for extreme small screens.
- Consider adding telemetry for service worker update and fallback paths to detect cache issues in production.

## Update - 2026-03-23 (Control Density)

- Trip distance slider was moved from the vertical rail beside the speedometer to the top control section.
- Primary controls were compacted so each control renders in a single row: label, current value, and slider.
- This reduces vertical usage and preserves more space for the speedometer in mobile viewports.
