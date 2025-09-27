# Backend — Complete Setup

This document explains how to run the backend locally (emulator or cloud), seed the DB, and common troubleshooting. Use PowerShell on Windows.

Requirements
- Node 18+ and pnpm
- Firebase CLI (optional for emulator): npm i -g firebase-tools
- If using cloud Firestore: a Firebase project + service account (do NOT commit JSON)

Quick commands (one-liners)
- Install deps:
  cd C:\TrelloApp\Trello-App\backend
  pnpm install
- Start emulator:
  pnpm run emulators:start
- Seed emulator:
  # PowerShell
  $env:USE_FIRESTORE_EMULATOR="1"
  $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
  pnpm run seed
- Run backend:
  pnpm run dev

.env (edit backend/.env or copy from .env.example)
- Do NOT commit .env or service account JSON.
- Example key values (safe for local emulator):
  FIREBASE_PROJECT_ID=trello-app-c831f
  FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@trello-app-c831f.iam.gserviceaccount.com
  FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY\n"
  USE_FIRESTORE_EMULATOR=1
  FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
  JWT_SECRET=change_me_securely
  SMTP_HOST=            # optional
  SMTP_USER=
  SMTP_PASS=

Emulator vs Cloud
- Emulator (recommended for dev): start firebase emulators, set USE_FIRESTORE_EMULATOR=1 and FIRESTORE_EMULATOR_HOST before seeding or running backend. When the emulator is running, admin SDK will connect to it.
- Cloud Firestore: set GOOGLE_APPLICATION_CREDENTIALS pointing to your local service account JSON or populate FIREBASE_* env fields. Be careful: seeding then may write to cloud.

Seed script
- Use `pnpm run seed`. Ensure emulator is running and USE_FIRESTORE_EMULATOR=1 is set in the terminal session to seed emulator. The script seeds collections: users, boards, cards, tasks, invitations, githubAttachments.

Run flow (recommended)
1. Open terminal A:
   cd C:\TrelloApp\Trello-App\backend
   pnpm run emulators:start
2. Open terminal B:
   cd C:\TrelloApp\Trello-App\backend
   $env:USE_FIRESTORE_EMULATOR="1"
   $env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
   pnpm run seed
   pnpm run dev
3. Visit:
   - Emulator UI: http://127.0.0.1:4000
   - Backend: http://localhost:4000

Test endpoints (curl examples)
- Signup (send code):
  curl -X POST http://localhost:4000/auth/signup -H "Content-Type: application/json" -d "{\"email\":\"alice@example.com\"}"
- Signin (use saved code):
  curl -X POST http://localhost:4000/auth/signin -H "Content-Type: application/json" -d "{\"email\":\"alice@example.com\",\"code\":\"123456\"}"
- Boards (replace TOKEN):
  curl -H "Authorization: Bearer <TOKEN>" http://localhost:4000/boards

Important notes & troubleshooting
- dotenv: index.js requires dotenv — .env is loaded only when running `node index.js` (nodemon). A plain `node -e` does not load .env unless you use -r dotenv/config.
- If emulator UI shows empty: you seeded cloud Firestore (not emulator). Ensure USE_FIRESTORE_EMULATOR is set and emulator is running before seeding.
- If `GOOGLE_APPLICATION_CREDENTIALS` is set, admin SDK prefers that file — unset it to force env-based cert or emulator.
- If a Firebase service account file was accidentally committed: remove it from git index, rotate the key in Firebase Console, and add ignore rules.
  git rm --cached backend/<file>.json
  git commit -m "chore(security): remove firebase service account"
- SSH / pnpm issues: if pnpm install prompts for SSH passphrase, add SSH key to ssh-agent or convert to HTTPS remotes.

Git & branch
- Create feature branch and commit changes with small messages:
  git switch -c feature/backend-skeleton
  git add .
  git commit -m "feat(backend): scaffold express server, auth email-code and boards CRUD"
  git push -u origin feature/backend-skeleton

Files of interest
- index.js — server + firebase init
- routes/auth.js — signup/signin (email-code)
- routes/boards.js — CRUD endpoints
- middleware/auth.js — JWT guard
- scripts/seedFirestore.js — seed script
- firebase.json, .firebaserc — emulator config

If you want, I can:
- patch seedFirestore.js to auto-detect emulator and avoid cloud writes,
- remove service account from git index for you,
- add a Postman collection or simple smoke tests.