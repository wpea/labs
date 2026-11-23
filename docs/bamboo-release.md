# Bamboo frontend release

This build depends on the `/api/bamboo/*` endpoints in sibling `wpea-v2`. Coordinate deployment with the backend; the old frontend uses retired JWT/proxy routes. Set `NEXT_PUBLIC_HOSTNAME` to the matching backend API base (including `/api`) in Vercel, then rebuild. No Bamboo password, app key, tenant token or user JWT belongs in frontend environment variables or storage.

Backend configuration, account linking, event setup, sandbox acceptance and rollback are documented in `../wpea-v2/docs/bamboo-rollout.md` (relative to the two repository roots).

Vercel configuration checked in Safari on 23 November 2026: team `wpeas-projects`, project `labs-ycax`, connected repository `wpea/labs`, Next.js preset and repository root. `NEXT_PUBLIC_HOSTNAME` is already `https://client.wealthparadigm.org/api` for Production and Preview. Preview therefore currently uses the live backend; use a separate backend before sandbox acceptance. No new frontend Bamboo credential is required.

Removed the unused `NEXT_PUBLIC_B_APP_USERNAME`, `NEXT_PUBLIC_B_APP_KEY`, and `NEXT_PUBLIC_B_APP_PW` variables from all environments after confirmation, and verified their absence after reloading Vercel. This does not rotate backend credentials or alter existing deployment artifacts. Retained `NEXT_PUBLIC_NODE_BACKEND` (still used), plus the legacy Bamboo URL and Mono variables until the coordinated release; the currently deployed source still references `NEXT_PUBLIC_BAMBOO_LIVE` and `NEXT_PUBLIC_MONO`. No deployment was triggered. Vercel currently selects Node.js 24.x and `npm install --legacy-peer-deps`; validate the release build against those settings before promotion.

Validation: `npm run build`. Browser checks with a local mock API covered a five-second account response (one account request followed by one concurrent batch), opening/closing Trade without a portfolio refresh, invalidating an edited quote, switching accounts during a delayed response, and a holdings failure followed by successful retry. These are simulated checks, not production financial transactions.
