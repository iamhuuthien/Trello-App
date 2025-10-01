# Frontend — Quick Setup (Next.js)

Summary
- Framework: Next.js (tested with Next 15), React 19
- Node: 18.x or 20.x (LTS recommended)
- Package manager: pnpm (>=7)
- Styling: Tailwind/PostCSS (already configured)
- Purpose: Client for the TrelloApp backend (NEXT_PUBLIC_API_URL)

Prereqs
- Node 18+ and pnpm installed
  - Check: node -v && pnpm -v
- (Optional) Firebase project and client config from Firebase Console

Install
- Windows PowerShell:
  cd C:\TrelloApp\Trello-App\frontend
  pnpm install
- macOS / Linux:
  cd ~/path/to/trello-app/frontend
  pnpm install

Environment
- Copy template:
  cp .env.example .env.local
- Fill Firebase client values from Firebase Console → Project settings → SDK configuration (Web)
- Ensure NEXT_PUBLIC_API_URL points to backend (default http://localhost:4001)

.dev / build
- Dev (hot reload):
  pnpm dev
- Build:
  pnpm build
- Preview production build:
  pnpm start

Firebase notes (client)
- Provide NEXT_PUBLIC_FIREBASE_* vars (API key, project id, authDomain, etc.)
- For local emulators you can keep env keys from the real project and point backend to emulator.

Common commands
- Lint: pnpm lint
- Test: pnpm test (if configured)
- Format: pnpm format

Deployment
- Use Vercel / Netlify / Host of choice.
- Set env vars in host UI (do NOT commit .env files).
- Ensure NEXT_PUBLIC_API_URL points to deployed backend.

Tips
- Use .env.local for developer overrides (ignored by git).
- For quick frontend-only testing, set NEXT_PUBLIC_ENABLE_REALTIME=false to disable realtime features.
- If you change Tailwind config, rebuild dev server.

If you want, I can add:
- a small PowerShell script to inject Firebase private keys,
- or a docker-compose for a full dev stack (frontend + backend + emulator).
