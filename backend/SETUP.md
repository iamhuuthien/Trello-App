# Backend — Setup & Run (clean, repeatable)

This document explains how to get the backend running locally and the minimal configuration other developers need to know.

---

## Summary / Architecture
- Runtime: Node.js (LTS) — tested with Node 18/20.
- Package manager: pnpm (>=7, tested with pnpm 10).
- Frameworks / libs:
  - Express 5
  - firebase-admin (Firestore + Auth)
  - jsonwebtoken (JWT)
  - nodemailer / @sendgrid/mail for email
- Pattern: REST API server (Express) + Firebase Admin SDK as primary datastore. Auth via signed JWT tokens (issued by backend). Firestore used for boards/cards/tasks; renderer is frontend Next.js.

---

## Recommended Versions
- Node.js: 18.x or 20.x (LTS)
- pnpm: 7+ (use same pnpm version as repo if possible)
- Firebase CLI (optional for emulator): latest stable

Check:
- node -v
- pnpm -v
- npx firebase --version

---

## Quick Start (local dev)

1) Install
- Windows PowerShell:
  cd C:\TrelloApp\Trello-App\backend
  pnpm install

- macOS / Linux:
  cd ~/path/to/trello-app/backend
  pnpm install

2) Copy example env and edit
- cp .env.example .env
- Fill values (never commit `.env`).

3) Run (cloud Firestore)
- If using a real Firebase service account (cloud):
  - Set GOOGLE_APPLICATION_CREDENTIALS to your JSON key path OR populate FIREBASE_* vars in .env.
  - Start server:
    pnpm run dev

4) Run (recommended for local dev — Firestore emulator)
- Start emulator:
  pnpm run emulators:start
- In same shell set emulator env (PowerShell):
  $env:USE_FIRESTORE_EMULATOR="1"
  $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
  $env:FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"
- Seed demo data:
  pnpm run seed
- Start server:
  pnpm run dev

Server will listen on PORT (default 4001). Health check:
GET http://localhost:4001/health

---

## .env notes & examples
Use `.env.example` as reference. Key points:

- JWT_SECRET: set a strong random string for production.
- FIREBASE_PRIVATE_KEY: when placed in .env, it must be a single-line string with `\n` escapes:

Example (.env)
```
PORT=4001
JWT_SECRET=change_me_securely
FIREBASE_PROJECT_ID=trello-app-c831f
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...AB\n-----END PRIVATE KEY-----\n"
SENDGRID_API_KEY=SG.YOUR_KEY
SMTP_FROM="no-reply@your-domain.com"
```

To convert a JSON private key into escaped form:
- PowerShell (one-liner):
  $k=(Get-Content -Raw C:\path\to\service-account.json | ConvertFrom-Json).private_key -replace "`n","\\n"; echo $k
- Bash:
  PRIVATE=$(jq -r .private_key service-account.json | sed ':a;N;$!ba;s/\n/\\n/g'); echo "$PRIVATE"

Alternative: set `GOOGLE_APPLICATION_CREDENTIALS` to the JSON file path — then you don't need FIREBASE_* envs.

---

## Email configuration
- Preferred: Set SENDGRID_API_KEY + SMTP_FROM (verified sender).
- Fallback dev: If no SendGrid, module falls back to Ethereal (dev-only preview).
- SMTP vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS — used when configured.

---

## Scripts (package.json)
- pnpm run dev       — nodemon + node index.js (dev)
- pnpm run start     — node index.js (production)
- pnpm run seed      — scripts/seedFirestore.js (seed demo)
- pnpm run emulators:start — firebase emulators:start (firestore + auth)

---

## Seeding & tokens
- `pnpm run seed` or `node scripts/seed_two_users_and_tokens.js`
- `seed_two_users_and_tokens.js` writes `seed_tokens.json` with JWT tokens for quick frontend testing.

---

## Security & best practices
- NEVER commit `.env` or service account JSON.
- Rotate Firebase service account keys if accidentally leaked.
- For CI / production inject secrets through platform secret store (GitHub Actions, Vercel secrets, etc).
- Use strong `JWT_SECRET` in prod.

---

## Common troubleshooting
- Firestore permission/credential errors: ensure correct role/key or run the emulator and set USE_FIRESTORE_EMULATOR=1.
- Private key parse error: check you preserved `\n` escapes or used GOOGLE_APPLICATION_CREDENTIALS.
- If emails fail: check SENDGRID_API_KEY and SMTP_FROM; look for provider response in server logs.

---

## Deployment notes (short)
- Provide GOOGLE_APPLICATION_CREDENTIALS via host secret (or set FIREBASE_* correctly).
- Use environment variables through host (do not embed secrets).
- Run `pnpm install --prod` and `pnpm run start` (or use a process manager).

---

If you want, I can:
- generate a `.env.example` (already present) with clearer comments,
- add a small PowerShell script `scripts/setup-env.ps1` to help format private key into .env,
- or write a Dockerfile + docker-compose for consistent dev environment.

Reply "apply scripts" / "add docker" / "add env helper" to get that next.
```# Backend — Setup & Run (clean, repeatable)

This document explains how to get the backend running locally and the minimal configuration other developers need to know.

---

## Summary / Architecture
- Runtime: Node.js (LTS) — tested with Node 18/20.
- Package manager: pnpm (>=7, tested with pnpm 10).
- Frameworks / libs:
  - Express 5
  - firebase-admin (Firestore + Auth)
  - jsonwebtoken (JWT)
  - nodemailer / @sendgrid/mail for email
- Pattern: REST API server (Express) + Firebase Admin SDK as primary datastore. Auth via signed JWT tokens (issued by backend). Firestore used for boards/cards/tasks; renderer is frontend Next.js.

---

## Recommended Versions
- Node.js: 18.x or 20.x (LTS)
- pnpm: 7+ (use same pnpm version as repo if possible)
- Firebase CLI (optional for emulator): latest stable

Check:
- node -v
- pnpm -v
- npx firebase --version

---

## Quick Start (local dev)

1) Install
- Windows PowerShell:
  cd C:\TrelloApp\Trello-App\backend
  pnpm install

- macOS / Linux:
  cd ~/path/to/trello-app/backend
  pnpm install

2) Copy example env and edit
- cp .env.example .env
- Fill values (never commit `.env`).

3) Run (cloud Firestore)
- If using a real Firebase service account (cloud):
  - Set GOOGLE_APPLICATION_CREDENTIALS to your JSON key path OR populate FIREBASE_* vars in .env.
  - Start server:
    pnpm run dev

4) Run (recommended for local dev — Firestore emulator)
- Start emulator:
  pnpm run emulators:start
- In same shell set emulator env (PowerShell):
  $env:USE_FIRESTORE_EMULATOR="1"
  $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
  $env:FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"
- Seed demo data:
  pnpm run seed
- Start server:
  pnpm run dev

Server will listen on PORT (default 4001). Health check:
GET http://localhost:4001/health

---

## .env notes & examples
Use `.env.example` as reference. Key points:

-_SECRET: set a strong random string for production.
- FIREBASE_PRIVATE_KEY: when placed in .env, it must be a single-line string with `\n` escapes:

Example (.env)
```
PORT=4001
JWT_SECRET=change_me_securely
FIREBASE_PROJECT_ID=trello-app-c831f
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...AB\n-----END PRIVATE KEY-----\n"
SENDGRID_API_KEY=SG.YOUR_KEY
SMTP_FROM="no-reply@your-domain.com"
```

To convert a JSON private key into escaped form:
- PowerShell (one-liner):
  $k=(Get-Content -Raw C:\path\to\service-account.json | ConvertFrom-Json).private_key -replace "`n","\\n"; echo $k
- Bash:
  PRIVATE=$(jq -r .private_key service-account.json | sed ':a;N;$!ba;s/\n/\\n/g'); echo "$PRIVATE"

Alternative: set `GOOGLE_APPLICATION_CREDENTIALS` to the JSON file path — then you don't need FIREBASE_* envs.

---

## Email configuration
- Preferred: Set SENDGRID_API_KEY + SMTP_FROM (verified sender).
- Fallback dev: If no SendGrid, module falls back to Ethereal (dev-only preview).
- SMTP vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS — used when configured.

---

## Scripts (package.json)
- pnpm run dev       — nodemon + node index.js (dev)
- pnpm run start     — node index.js (production)
- pnpm run seed      — scripts/seedFirestore.js (seed demo)
- pnpm run emulators:start — firebase emulators:start (firestore + auth)

---

## Seeding & tokens
- `pnpm run seed` or `node scripts/seed_two_users_and_tokens.js`
- `seed_two_users_and_tokens.js` writes `seed_tokens.json` with JWT tokens for quick frontend testing.

---

## Security & best practices
- NEVER commit `.env` or service account JSON.
- Rotate Firebase service account keys if accidentally leaked.
- For CI / production inject secrets through platform secret store (GitHub Actions, Vercel secrets, etc).
- Use strong `JWT_SECRET` in prod.

---

## Common troubleshooting
- Firestore permission/credential errors: ensure correct role/key or run the emulator and set USE_FIRESTORE_EMULATOR=1.
- Private key parse error: check you preserved `\n` escapes or used GOOGLE_APPLICATION_CREDENTIALS.
- If emails fail: check SENDGRID_API_KEY and SMTP_FROM; look for provider response in server logs.

---

## Deployment notes (short)
- Provide GOOGLE_APPLICATION_CREDENTIALS via host secret (or set FIREBASE_* correctly).
- Use environment variables through host (do not embed secrets).
- Run `pnpm install --prod` and `pnpm run start` (or use a process manager).

---

If you want, I can:
- generate a `.env.example` (already present) with clearer comments,
- add a small PowerShell script `scripts/setup-env.ps1` to help format private key into .env,
- or write a Dockerfile + docker-compose for consistent dev environment.

