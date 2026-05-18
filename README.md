# Bultman Advisory Client Portal Prototype

A working React/Firebase prototype for the Bultman Advisory client portal: collection inventory, secure documents, reporting/market updates, advisor messaging, role-based views, and audit logging.

## Stack

- Vite + React + TypeScript
- Firebase Web SDK: Auth, Firestore, Storage
- Firebase Hosting config included
- GitHub Pages deploy fallback for fast prototype URL

## Firebase project

Configured for project id `bultman-advisory`. Add the web app config values to `.env`:

```bash
cp .env.example .env
# fill VITE_FIREBASE_* values from Firebase console/web app config
```

If config is missing, the app runs in Firebase-ready demo mode with seeded data so reviewers can exercise the full UX without secrets.

## Local run

```bash
pnpm install
pnpm run dev
pnpm test
pnpm run build
```

## Deploy

Firebase Hosting:

```bash
firebase deploy --project bultman-advisory
```

GitHub Pages prototype:

```bash
GITHUB_PAGES=true pnpm run build
pnpm exec gh-pages -d dist
```

## Security model included

- Firestore rules enforce role/client-scoped reads and advisor/owner writes.
- Storage rules scope files to `clients/{clientId}/...`.
- Audit events are append-only.
- Financial visibility is role-gated in UI; production should add field-level encryption / Secret Manager before storing live bank/tax data.
