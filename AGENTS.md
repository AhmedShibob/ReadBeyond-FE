# AGENTS.md

## Cursor Cloud specific instructions

### Overview

ReadBeyond is a **Nuxt 4 (Vue 3) frontend-only** mobile-first web app for translating text extracted from images via OCR. The backend API (OCR + translation endpoints) is **external** and not included in this repository.

### Running the dev server

```bash
yarn dev
```

Starts on `http://localhost:3000`. See `package.json` for all available scripts (`dev`, `build`, `preview`, `generate`).

### Linting

There is no `yarn lint` script defined. Run ESLint directly:

```bash
npx eslint .
```

### Environment variables

- `API_BASE_URL` — Backend API URL (defaults to `http://localhost:3000`, which conflicts with the Nuxt dev server port; set a different URL if a backend is available)
- `SITE_URL` — Site URL for SEO/meta
- `GOOGLE_ANALYTICS_ID` — GA tracking (production only)

### Notable caveats

- The `API_BASE_URL` default (`http://localhost:3000`) collides with the Nuxt dev server port. If running a local backend, either change the Nuxt dev port (`yarn dev --port 3001`) or set `API_BASE_URL` to point elsewhere.
- OCR and translation features require the external backend API. Without it, the UI loads fine but API calls to `/api/upload` and `/api/translate` will fail.
- `nuxt prepare` runs automatically via the `postinstall` script after `yarn install`, generating types in `.nuxt/`.
- The ESLint config at `eslint.config.mjs` imports from `.nuxt/eslint.config.mjs`, so `yarn install` (which triggers `nuxt prepare`) must complete before linting will work.
