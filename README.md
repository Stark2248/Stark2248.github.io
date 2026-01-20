# Amlan Das — Portfolio (Vite + React + NestJS)

This repository contains a Vite + React frontend and a minimal NestJS backend. The frontend is configured to build into the `docs/` folder so it can be deployed to GitHub Pages.

Quick overview
- Frontend: `frontend/` — Vite + React app (site, components, animations, Supabase integration)
- Backend (optional): `backend/` — NestJS app used earlier for local message persistence
- Deploy: The frontend is built and published to GitHub Pages (`gh-pages` branch) via GitHub Actions

Local development

Prerequisites
- Node.js 18+
- npm

Frontend
1. Install and run the dev server:

```bash
cd frontend
npm ci
npm run dev
```

2. Build for production:

```bash
npm run build
```

3. Preview the built site (optional):

```bash
# if build outputs to ../docs (default in this repo)
python -m http.server --directory ../docs 8000
# or preview dist if you change outDir
```

Environment variables (frontend)
- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — your Supabase anon/public key

Create a `frontend/.env` file with these variables during local development. Restart Vite after editing `.env`.

Supabase
- The frontend uses Supabase for message persistence. See `frontend/supabase-setup.md` for the SQL definition and RLS policy recommendations.

GitHub Pages CI / Deployment
- A GitHub Actions workflow builds the frontend and publishes it to the `gh-pages` branch. The workflow file is at `.github/workflows/gh-pages.yml`.
- For user/organization Pages (username.github.io), CI can publish to `master` if you prefer, but GitHub blocks `GITHUB_TOKEN` pushes to the branch that triggers the workflow; use a PAT if you need that.

Troubleshooting
- "Jekyll SCSS" errors: ensure the build output is present in `docs/` or configure Pages to serve from the `gh-pages` branch.
- Missing Supabase env vars in CI: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to repository secrets.

Notes and next steps
- I added improved animations, message ghost overlay, and simpler production chunking in `frontend/vite.config.js`.
- If you want, I can tidy the workflow further, add Brotli/Gzip prebake, or configure caching headers on a static host.

If you want a tailored README (shorter or with screenshots), tell me what to include and I'll update it.

Frontend:

```powershell
cd C:\Users\Dasam\Stark2248\frontend
npm install
npm run dev
```

Backend:

```powershell
cd C:\Users\Dasam\Stark2248\backend
npm install
npm run start:dev
```

