# 🎨 Frontend Setup Guide

A comprehensive guide to set up and run the TrelloApp frontend. This modern web application is built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

---

## 📋 Tech Stack & Architecture

### Core Technologies
- **Runtime**: [Node.js](https://nodejs.org/) 18.x/20.x LTS
- **Framework**: [Next.js](https://nextjs.org/) 15.5.4 with App Router
- **UI Library**: [React](https://react.dev/) 19.1.0
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5.x
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4.0.0-beta.14
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/) 6.3.0
- **Icons**: [Lucide React](https://lucide.dev/) 0.544.0
- **HTTP Client**: [Axios](https://axios-http.com/) 1.7.9
- **Package Manager**: [pnpm](https://pnpm.io/) 10.17.1

### Architecture Pattern
```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js App Router                      │
├─────────────────────────────────────────────────────────────┤
│  Pages (app/)              Components                        │
│  ├─ boards/               ├─ auth/                          │
│  ├─ login/                ├─ board/ (Kanban)                │
│  ├─ signup/               ├─ layout/ (AppShell)             │
│  └─ profile/              └─ ui/ (Design System)            │
├─────────────────────────────────────────────────────────────┤
│  State Management          API Layer                         │
│  ├─ Context (Auth)        └─ services/api.ts (Axios)        │
│  └─ Custom Hooks                                             │
├─────────────────────────────────────────────────────────────┤
│                    Backend REST API                          │
│              (Express.js + Firebase)                         │
└─────────────────────────────────────────────────────────────┘
```

**Design Pattern**: 
- **Component-based architecture** with TypeScript interfaces
- **Context API** for global state (Auth, Toast)
- **Custom hooks** for data fetching and business logic
- **Service layer** for API communication
- **Responsive design** with mobile-first approach

---

## 🔧 Prerequisites

### Required Software
| Tool | Version | Check Command | Install |
|------|---------|---------------|---------|
| **Node.js** | 18.x/20.x LTS | `node --version` | [nodejs.org](https://nodejs.org/) |
| **pnpm** | 10.0+ | `pnpm --version` | `npm install -g pnpm` |
| **Git** | Latest | `git --version` | [git-scm.com](https://git-scm.com/) |

### Optional Tools
- **VS Code**: Recommended editor
  - Extensions: ESLint, Prettier, Tailwind CSS IntelliSense, TypeScript
- **React DevTools**: Browser extension for debugging
- **Redux DevTools**: For state inspection (if needed)

---

## ⚡ Quick Start

### 1. Installation

**Windows (PowerShell):**
```powershell
# Navigate to frontend directory
cd C:\TrelloApp\Trello-App\frontend

# Install dependencies
pnpm install

# Verify installation
pnpm list --depth=0
```

**macOS/Linux:**
```bash
# Navigate to frontend directory
cd ~/path/to/Trello-App/frontend

# Install dependencies
pnpm install

# Verify installation
pnpm list --depth=0
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Windows PowerShell alternative:
# Copy-Item .env.example .env.local

# Edit configuration (see Environment Variables section)
code .env.local  # or nano .env.local
```

### 3. Backend Connection
**⚠️ Important: Ensure backend is running before starting frontend!**

```bash
# In another terminal, start backend server
cd ../backend
pnpm run dev

# Verify backend health
curl http://localhost:4001/health
# Expected: {"ok":true}

# Windows PowerShell alternative:
# Invoke-WebRequest -Uri http://localhost:4001/health
```

### 4. Start Development Server
```bash
# Start Next.js dev server with Turbopack (recommended)
pnpm dev

# Alternative: without Turbopack
pnpm dev -- --no-turbopack

# Server will start on http://localhost:3000
```

### 5. Access Application
Open your browser and navigate to:
- **Homepage**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Signup**: http://localhost:3000/signup
- **Boards**: http://localhost:3000/boards

---

## 🔐 Environment Variables

### Required Configuration
Create `.env.local` file in the frontend root directory:

```env
# Backend API URL (must match backend PORT)
NEXT_PUBLIC_API_URL=http://localhost:4001

# Firebase Client Configuration (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_REALTIME=true
```

### 🔑 Getting Firebase Config

**Step-by-step guide:**

1. **Open Firebase Console**: Go to [Firebase Console](https://console.firebase.google.com/)
2. **Select Project**: Click on your project (e.g., `trello-app-c831f`)
3. **Project Settings**: Click the ⚙️ icon → **Project settings**
4. **Web App Configuration**:
   - Scroll to **Your apps** section
   - If no web app exists, click **Add app** → Web icon `</>`
   - Give it a nickname (e.g., "TrelloApp Frontend")
   - Click **Register app**
5. **Copy Config**: Copy the configuration values

**Example Firebase Console → SDK Configuration:**
```javascript
// Copy these values to .env.local
const firebaseConfig = {
  apiKey: "AIzaSy...",                    // → NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "project.firebaseapp.com",  // → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "project-id",                // → NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "project.appspot.com",   // → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456",            // → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123:web:abc",                 // → NEXT_PUBLIC_FIREBASE_APP_ID
  measurementId: "G-XXX"                  // → NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
```

**⚠️ Important Notes:**
- Never commit `.env.local` to git (already in `.gitignore`)
- For production, set these variables in your hosting platform (Vercel, Netlify, etc.)
- Backend and Frontend must use the **same Firebase project**

---

## 📝 Available Scripts

| Command | Description | Usage |
|---------|-------------|-------|
| `pnpm dev` | Start development server with Turbopack | Development |
| `pnpm build` | Build production-optimized bundle | Pre-deployment |
| `pnpm start` | Start production server (after build) | Production |
| `pnpm lint` | Run ESLint for code quality | CI/CD |
| `pnpm lint:fix` | Auto-fix ESLint issues | Development |
| `pnpm type-check` | Run TypeScript compiler check | CI/CD |

### Script Examples

**Development:**
```bash
# Start dev server (with Turbopack)
pnpm dev

# Start without Turbopack
pnpm dev -- --no-turbopack

# Dev server on different port
pnpm dev -- -p 3001
```

**Production:**
```bash
# Build production bundle
pnpm build

# Start production server (after build)
pnpm start

# Test production build locally
pnpm build && pnpm start
```

**Code Quality:**
```bash
# Run linter
pnpm lint

# Fix linting issues automatically
pnpm lint:fix

# Type check (no emit)
pnpm type-check

# Run all checks (lint + type-check)
pnpm lint && pnpm type-check
```

---

## 🗂️ Project Structure

```
frontend/
├── 📁 public/                    # Static assets (served at root)
│   ├── next.svg                  # Next.js logo
│   ├── vercel.svg                # Vercel logo
│   └── *.svg                     # Other static images
├── 📁 src/
│   ├── 📁 app/                   # Next.js App Router (file-based routing)
│   │   ├── layout.tsx            # Root layout (AuthProvider, ToastProvider)
│   │   ├── page.tsx              # Homepage (/)
│   │   ├── globals.css           # Global styles + Tailwind imports
│   │   ├── favicon.ico           # Website favicon
│   │   ├── 📁 boards/            # Board management routes
│   │   │   ├── page.tsx          # Boards list page (/boards)
│   │   │   ├── 📁 [id]/          # Dynamic route (board detail)
│   │   │   │   └── page.tsx      # Board detail page (/boards/:id)
│   │   │   └── 📁 new/           # Create new board
│   │   │       └── page.tsx      # New board form (/boards/new)
│   │   ├── 📁 login/             # Authentication
│   │   │   └── page.tsx          # Login page (/login)
│   │   ├── 📁 signup/            # User registration
│   │   │   └── page.tsx          # Signup page (/signup)
│   │   ├── 📁 profile/           # User profile
│   │   │   └── page.tsx          # Profile settings (/profile)
│   │   └── 📁 dashboard/         # Dashboard (future feature)
│   ├── 📁 components/            # Reusable React components
│   │   ├── 📁 auth/              # Authentication components
│   │   │   ├── LoginCard.tsx     # Login form with email verification
│   │   │   └── EmailVerification.tsx  # Email code verification UI
│   │   ├── 📁 board/             # Board & Kanban components
│   │   │   ├── BoardCard.tsx     # Board preview card (grid view)
│   │   │   ├── BoardHeader.tsx   # Board page header (title, actions)
│   │   │   ├── KanbanBoard.tsx   # Main Kanban container (DnD context)
│   │   │   ├── KanbanColumn.tsx  # Droppable column
│   │   │   ├── KanbanCard.tsx    # Draggable card item
│   │   │   ├── CardDetailModal.tsx    # Card detail modal (tasks, comments)
│   │   │   ├── CardFormModal.tsx      # Card create/edit modal
│   │   │   ├── CreateBoardForm.tsx    # New board form
│   │   │   └── BoardPageClient.tsx    # Client-side board state
│   │   ├── 📁 card/              # Card components
│   │   │   ├── CardItem.tsx      # Single card display
│   │   │   └── CardList.tsx      # Card list container
│   │   ├── 📁 layout/            # Layout & navigation
│   │   │   ├── AppShell.tsx      # Main app layout (navbar + sidebar)
│   │   │   ├── Navbar.tsx        # Top navigation bar
│   │   │   ├── Sidebar.tsx       # Left sidebar (collapsed/expanded)
│   │   │   ├── UserMenu.tsx      # User dropdown menu
│   │   │   ├── ClientGuard.tsx   # Protected route wrapper
│   │   │   ├── LayoutRenderer.tsx     # Layout switcher (auth vs app)
│   │   │   └── RecentBoards.tsx  # Recent boards sidebar widget
│   │   ├── 📁 profile/           # Profile components
│   │   │   └── ProfileForm.tsx   # User profile edit form
│   │   ├── 📁 task/              # Task components (future)
│   │   └── 📁 ui/                # Design system components
│   │       ├── Avatar.tsx        # User avatar with fallback
│   │       ├── Button.tsx        # Custom button (variants)
│   │       ├── Card.tsx          # Card container
│   │       ├── Input.tsx         # Form input with label
│   │       ├── IconButton.tsx    # Icon-only button
│   │       ├── LoadingSpinner.tsx     # Loading spinner animation
│   │       ├── EmptyState.tsx    # Empty state illustration
│   │       ├── Toast.tsx         # Toast notification
│   │       ├── ConfirmModal.tsx  # Confirmation dialog
│   │       ├── ConfirmProvider.tsx    # Confirm dialog context
│   │       ├── SkeletonBoardCard.tsx  # Loading skeleton (boards)
│   │       └── SkeletonBoardDetail.tsx # Loading skeleton (board detail)
│   ├── 📁 context/               # React Context providers
│   │   ├── AuthContext.tsx       # Authentication state (user, token, login, logout)
│   │   └── ToastContext.tsx      # Toast notification system
│   ├── 📁 hooks/                 # Custom React hooks
│   │   ├── useAuth.ts            # Auth hook (wraps AuthContext)
│   │   ├── useBoards.ts          # Boards list with CRUD
│   │   ├── useBoard.ts           # Single board operations
│   │   ├── useCards.ts           # Cards CRUD operations
│   │   └── useTasks.ts           # Tasks CRUD operations
│   ├── 📁 services/              # API communication layer
│   │   └── api.ts                # Axios client (interceptors, auth headers)
│   ├── 📁 types/                 # TypeScript type definitions
│   │   └── index.ts              # Shared interfaces (User, Board, Card, Task)
│   └── 📁 lib/                   # Utility functions (future)
├── 📁 tools/                     # Development tools
│   └── replace-blocking-dialogs.js  # Script to replace window.confirm/alert
├── 📄 .env.example               # Environment variables template
├── 📄 .env.local                 # Local environment (gitignored)
├── 📄 .gitignore                 # Git ignore rules
├── 📄 eslint.config.mjs          # ESLint configuration (Next.js 15 flat config)
├── 📄 next.config.ts             # Next.js configuration
├── 📄 next-env.d.ts              # Next.js TypeScript types
├── 📄 package.json               # Dependencies & scripts
├── 📄 pnpm-lock.yaml             # pnpm lock file
├── 📄 postcss.config.mjs         # PostCSS config (Tailwind)
├── 📄 tailwind.config.ts         # Tailwind CSS configuration
├── 📄 tsconfig.json              # TypeScript compiler options
└── 📄 SETUP.md                   # This setup guide
```

---

## 🎨 Component Architecture

### Design System (`components/ui/`)
**Philosophy**: Reusable, accessible, type-safe UI primitives

**Components:**
- **Button**: Primary, secondary, outline, ghost variants with sizes
- **Input**: Form inputs with label, error states, and validation
- **Card**: Content container with hover effects
- **Avatar**: User profile image with fallback initials
- **Toast**: Non-blocking notification system (success, error, info)
- **Modal**: Confirmation dialogs with async actions
- **Skeleton**: Loading state placeholders

### Feature Components

**Authentication (`components/auth/`):**
- `LoginCard.tsx`: Email-based login form
- `EmailVerification.tsx`: Verification code input (6 digits)

**Board Management (`components/board/`):**
- `KanbanBoard.tsx`: Drag-and-drop board (DnD Kit)
- `KanbanColumn.tsx`: Droppable column container
- `KanbanCard.tsx`: Draggable card with priority indicators
- `CardDetailModal.tsx`: Full card details (tasks, description, members)
- `CardFormModal.tsx`: Create/edit card form

**Layout (`components/layout/`):**
- `AppShell.tsx`: Main app wrapper (navbar + sidebar + content)
- `Navbar.tsx`: Top navigation with search and user menu
- `Sidebar.tsx`: Collapsible sidebar (projects, favorites)
- `ClientGuard.tsx`: Protected route wrapper (checks auth)

### State Management

**Global State (Context API):**
```typescript
// Authentication state
AuthContext {
  user: User | null
  token: string | null
  login: (email: string, code: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

// Toast notifications
ToastContext {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
}
```

**Data Fetching (Custom Hooks):**
```typescript
// Boards
useBoards()      → { boards, loading, createBoard, deleteBoard }
useBoard(id)     → { board, loading, updateBoard, addColumn }

// Cards
useCards(boardId) → { cards, loading, createCard, updateCard, deleteCard }

// Tasks
useTasks(cardId)  → { tasks, loading, createTask, updateTask, deleteTask, assignMember }
```

**API Layer (`services/api.ts`):**
```typescript
// Axios instance with interceptors
- Request interceptor: Add auth token
- Response interceptor: Handle 401 (logout), 403, 500
```

---

## 🧪 Testing & Development

### Manual Testing Flow

**1. Start Backend:**
```bash
# Terminal 1 (backend)
cd ../backend
pnpm run dev

# Verify health
curl http://localhost:4001/health
# Expected: {"ok":true}
```

**2. Start Frontend:**
```bash
# Terminal 2 (frontend)
pnpm dev

# Open browser
open http://localhost:3000  # macOS
start http://localhost:3000 # Windows
```

**3. Test User Flow:**
```
a) Signup Flow:
   → Navigate to /signup
   → Enter email (e.g., test@example.com)
   → Check email/console for verification code
   → Enter 6-digit code
   → Redirected to /boards

b) Board Management:
   → Click "Create Board"
   → Enter board name and description
   → Add columns (To Do, In Progress, Done)
   → Create cards in columns

c) Drag & Drop:
   → Drag card between columns
   → Verify position persists after refresh

d) Card Details:
   → Click card to open detail modal
   → Add tasks (checkbox list)
   → Add description
   → Assign members (if available)

e) Profile:
   → Navigate to /profile
   → Update name and email
   → Save changes
```

### Using Demo Tokens

**Backend Seed Data:**
```bash
# Backend must have seed data
cd ../backend
pnpm run seed

# Check seed_tokens.json
cat seed_tokens.json  # macOS/Linux
type seed_tokens.json # Windows
```

**Use Token in Browser:**
```javascript
// Open browser console (F12)
// Copy token from seed_tokens.json
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')

// Refresh page
location.reload()

// Verify auth state
JSON.parse(localStorage.getItem('token'))
```

### Browser DevTools Debugging

**Check Authentication:**
```javascript
// Console (F12 → Console tab)
localStorage.getItem('token')     // JWT token
JSON.parse(localStorage.getItem('token')) // Decoded payload
```

**Monitor API Calls:**
```
1. Open DevTools (F12)
2. Go to Network tab
3. Filter: XHR/Fetch
4. Perform action (create board, etc.)
5. Check request/response:
   - Headers (Authorization: Bearer ...)
   - Payload (request body)
   - Status code (200, 401, 500)
```

**React Component State:**
```
1. Install React DevTools extension
2. Open DevTools → Components tab
3. Select component (e.g., AuthContext)
4. Inspect props/state/hooks
```

**Performance Profiling:**
```
1. DevTools → Lighthouse tab
2. Run audit (Performance, Accessibility, SEO)
3. Check metrics (FCP, LCP, CLS)
```

---

## 🚨 Troubleshooting

### Common Issues

#### ❌ Backend Connection Error
```bash
# Problem: "Network Error" or "ERR_CONNECTION_REFUSED"
# Cause: Backend not running or wrong API_URL

# Solution 1: Verify backend is running
cd ../backend
pnpm run dev
curl http://localhost:4001/health

# Solution 2: Check NEXT_PUBLIC_API_URL in .env.local
# Should be: http://localhost:4001 (no trailing slash)

# Solution 3: Check CORS on backend
# Backend must allow origin: http://localhost:3000
```

#### ❌ Firebase Configuration Error
```bash
# Problem: "Firebase: Error (auth/invalid-api-key)"
# Cause: Wrong Firebase config or missing .env.local

# Solution 1: Check .env.local exists
ls -la .env.local  # macOS/Linux
dir .env.local     # Windows

# Solution 2: Verify Firebase config
# Compare with Firebase Console → Project settings → SDK config

# Solution 3: Restart dev server after changing .env.local
# Stop (Ctrl+C) and run: pnpm dev
```

#### ❌ Module Not Found
```bash
# Problem: "Module not found: Can't resolve 'xyz'"
# Cause: Missing dependency or corrupted node_modules

# Solution: Clean install
rm -rf node_modules .next pnpm-lock.yaml
pnpm install

# Windows PowerShell:
Remove-Item -Recurse -Force node_modules, .next, pnpm-lock.yaml
pnpm install
```

#### ❌ Port 3000 Already in Use
```bash
# Problem: "EADDRINUSE :::3000"
# Cause: Another process using port 3000

# Solution 1: Kill process (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Solution 2: Kill process (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Solution 3: Use different port
pnpm dev -- -p 3001
# Update NEXT_PUBLIC_API_URL if backend expects specific origin
```

#### ❌ TypeScript Errors
```bash
# Problem: Type errors in components
# Cause: Missing type definitions or version mismatch

# Solution 1: Run type check
pnpm type-check

# Solution 2: Update TypeScript
pnpm add -D typescript@latest @types/react@latest @types/node@latest

# Solution 3: Clear TypeScript cache
rm -rf .next tsconfig.tsbuildinfo
pnpm dev
```

#### ❌ Tailwind Classes Not Working
```bash
# Problem: Styles not applying
# Cause: Tailwind config issue or PostCSS error

# Solution 1: Verify Tailwind setup
# Check tailwind.config.ts has correct content paths

# Solution 2: Clear Next.js cache
rm -rf .next
pnpm dev

# Solution 3: Rebuild Tailwind
pnpm add -D tailwindcss@latest postcss@latest autoprefixer@latest
```

#### ❌ Authentication Loop (Infinite Redirect)
```bash
# Problem: Redirected to /login repeatedly
# Cause: Expired token or auth state corruption

# Solution: Clear browser storage
# Open console (F12) and run:
localStorage.clear()
sessionStorage.clear()
location.reload()

# Or manually remove token:
localStorage.removeItem('token')
```

#### ❌ Drag and Drop Not Working
```bash
# Problem: Cards not draggable
# Cause: DnD Kit version issue or missing CSS

# Solution 1: Check @dnd-kit installed
pnpm list @dnd-kit/core @dnd-kit/sortable

# Solution 2: Verify KanbanBoard uses DndContext
# Check components/board/KanbanBoard.tsx

# Solution 3: Clear cache
rm -rf .next
pnpm dev
```

#### ❌ Environment Variables Not Loading
```bash
# Problem: process.env.NEXT_PUBLIC_* is undefined
# Cause: Wrong file name or server not restarted

# Solution 1: Verify file name is .env.local (not .env)
# Next.js loads in this order:
# .env.local → .env.development → .env

# Solution 2: Must use NEXT_PUBLIC_ prefix for client-side
# ✅ NEXT_PUBLIC_API_URL=http://localhost:4001
# ❌ API_URL=http://localhost:4001 (server-side only)

# Solution 3: Restart dev server after changes
# Ctrl+C then: pnpm dev
```

### Debug Mode

**Enable Verbose Logging:**
```bash
# Development
NEXT_PUBLIC_DEBUG=true pnpm dev

# Check build info
pnpm next info
```

**Analyze Bundle Size:**
```bash
# Build production bundle
pnpm build

# Check bundle size
# Output shown after build completes
# Look for largest chunks and optimize
```

**Performance Profiling:**
```bash
# Run Lighthouse audit
# Chrome DevTools → Lighthouse → Run audit

# Check metrics:
# - First Contentful Paint (FCP) < 1.8s
# - Largest Contentful Paint (LCP) < 2.5s
# - Cumulative Layout Shift (CLS) < 0.1
```

---

## 🚀 Deployment

### Pre-Deployment Checklist

- [ ] Update `NEXT_PUBLIC_API_URL` to production backend URL
- [ ] Configure Firebase production project (not emulator)
- [ ] Set all environment variables in hosting platform
- [ ] Run `pnpm build` locally to verify no errors
- [ ] Test production build: `pnpm build && pnpm start`
- [ ] Verify all features work in production mode
- [ ] Enable HTTPS (required for Firebase Auth)
- [ ] Configure custom domain (optional)
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Enable analytics (Vercel Analytics, Google Analytics)

### Production Build

```bash
# 1. Build optimized production bundle
pnpm build

# Output:
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
# ✓ Collecting page data
# ✓ Generating static pages
# ✓ Finalizing page optimization

# 2. Test production build locally
pnpm start

# 3. Open http://localhost:3000
# Verify all features work (auth, boards, drag-drop)

# 4. Check bundle size
# Look for warnings about large chunks (> 244 KB)
```

### Platform-Specific Deployment

#### Vercel (Recommended)

**Why Vercel:**
- ✅ Built by Next.js creators (best compatibility)
- ✅ Auto-deploys from Git
- ✅ Global CDN + Edge Functions
- ✅ Free SSL certificates
- ✅ Built-in analytics and monitoring

**Deploy with CLI:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project or create new
# - Select framework: Next.js
# - Build command: pnpm build
# - Output directory: .next
```

**Deploy with Git:**
```bash
# 1. Push to GitHub/GitLab/Bitbucket
git add .
git commit -m "feat: production ready"
git push origin main

# 2. Go to https://vercel.com/new
# 3. Import repository
# 4. Configure project:
#    - Framework Preset: Next.js
#    - Build Command: pnpm build
#    - Install Command: pnpm install

# 5. Add environment variables (Settings → Environment Variables):
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...

# 6. Deploy
# Vercel auto-deploys on push to main
```

**Custom Domain:**
```bash
# Vercel dashboard → Domains → Add domain
# Follow DNS setup instructions
# SSL auto-provisioned
```

#### Netlify

**netlify.toml:**
```toml
[build]
  command = "pnpm build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--prefix=/dev/null"
  PNPM_FLAGS = "--shamefully-hoist"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**Deploy:**
```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Initialize
netlify init

# 4. Deploy
netlify deploy --prod

# Or connect Git repository in Netlify dashboard
```

#### Docker

**Dockerfile:**
```dockerfile
# Multi-stage build for optimal image size
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN corepack enable pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable pnpm && pnpm build

# Production image, copy all files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:4001
      - NEXT_PUBLIC_FIREBASE_API_KEY=${FIREBASE_API_KEY}
      - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}
      - NEXT_PUBLIC_FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
      - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET}
      - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${FIREBASE_MESSAGING_SENDER_ID}
      - NEXT_PUBLIC_FIREBASE_APP_ID=${FIREBASE_APP_ID}
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

**Build and Run:**
```bash
# Build image
docker build -t trelloapp-frontend .

# Run container
docker run -p 3000:3000 --env-file .env.local trelloapp-frontend

# Or use docker-compose
docker-compose up -d
```

#### Railway / Render

**Railway:**
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize
railway init

# 4. Deploy
railway up

# Set environment variables in Railway dashboard
```

**Render:**
```yaml
# render.yaml
services:
  - type: web
    name: trelloapp-frontend
    env: node
    buildCommand: pnpm install && pnpm build
    startCommand: pnpm start
    envVars:
      - key: NODE_VERSION
        value: 20
      - key: NEXT_PUBLIC_API_URL
        value: https://your-backend.onrender.com
      # Add other NEXT_PUBLIC_* variables
```

### Post-Deployment

**Verify Deployment:**
```bash
# 1. Check deployment URL
curl -I https://your-app.vercel.app
# Should return 200 OK

# 2. Test authentication
# Open https://your-app.vercel.app/login
# Try login flow

# 3. Check console for errors
# Open DevTools → Console
# No errors should appear

# 4. Verify API connection
# DevTools → Network → Check API calls
# Should point to production backend
```

**Monitoring:**
```bash
# Vercel Analytics (built-in)
# Dashboard → Analytics tab

# Sentry (error tracking)
# Install: pnpm add @sentry/nextjs
# Configure sentry.client.config.js and sentry.server.config.js

# Google Analytics
# Add tracking code in app/layout.tsx
```

---

## 🔒 Security Best Practices

### Environment Variables

**Client vs Server:**
```env
# ✅ Client-safe (NEXT_PUBLIC_ prefix, embedded in bundle)
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...

# ❌ Server-only (no prefix, only in API routes/server components)
DATABASE_URL=postgres://...
API_SECRET_KEY=secret123
```

**Security Rules:**
- ✅ Never commit `.env.local` or `.env` files (use `.env.example`)
- ✅ Rotate Firebase API keys regularly (every 90 days)
- ✅ Use different Firebase projects for dev/staging/prod
- ✅ Store sensitive secrets in hosting platform (Vercel Secrets, etc.)
- ✅ Enable 2FA on Firebase Console account

### Authentication

**Token Storage:**
```typescript
// Current: localStorage (OK for MVP)
localStorage.setItem('token', jwt)

// Production: httpOnly cookies (more secure)
// Set cookie on backend after login
// Frontend automatically sends cookie with requests
// Prevents XSS attacks from stealing token
```

**Token Expiration:**
```typescript
// Backend JWT expires in 7 days
// Frontend should:
// 1. Check token expiration before each request
// 2. Auto-logout on 401 response
// 3. Refresh token before expiration (if refresh token implemented)

// services/api.ts interceptor handles this
```

**Protected Routes:**
```typescript
// Use ClientGuard component
<ClientGuard>
  <BoardsPage />
</ClientGuard>

// Or check in page component
export default function Page() {
  const { user } = useAuth()
  if (!user) redirect('/login')
  // ...
}
```

### API Security

**Request Headers:**
```typescript
// All authenticated requests include:
Authorization: Bearer <jwt_token>

// Backend verifies:
// 1. Token signature (JWT_SECRET)
// 2. Token expiration
// 3. User exists in database
```

**Input Validation:**
```typescript
// Validate all form inputs
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(50),
})

// Sanitize HTML (prevent XSS)
import DOMPurify from 'dompurify'
const clean = DOMPurify.sanitize(userInput)
```

**CORS:**
```typescript
// Backend must allow frontend origin
// backend/index.js
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-app.vercel.app'],
  credentials: true
}))
```

### Data Protection

**Sensitive Data:**
```typescript
// ✅ Do: Send sensitive data over HTTPS only
// ✅ Do: Validate input on both client and server
// ✅ Do: Use prepared statements (Firestore prevents SQL injection)
// ❌ Don't: Log sensitive data (passwords, tokens)
// ❌ Don't: Expose internal IDs in URLs (use UUIDs)
```

**Rate Limiting:**
```typescript
// Implement on backend
// Express rate limit middleware
// Prevents brute force attacks on login
```

---

## 📚 Additional Resources

### Official Documentation
- **[Next.js 15 Docs](https://nextjs.org/docs)** - Framework documentation
- **[React 19 Docs](https://react.dev/)** - React fundamentals
- **[Tailwind CSS v4](https://tailwindcss.com/docs)** - Styling framework
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - TypeScript guide
- **[DnD Kit](https://docs.dndkit.com/)** - Drag and drop library
- **[Axios](https://axios-http.com/docs/)** - HTTP client
- **[Firebase Client SDK](https://firebase.google.com/docs/web/setup)** - Firebase setup

### Tutorials & Guides
- **[Next.js Learn](https://nextjs.org/learn)** - Interactive tutorial
- **[React Tutorial](https://react.dev/learn)** - React fundamentals
- **[Tailwind Play](https://play.tailwindcss.com/)** - Try Tailwind online
- **[TypeScript for React](https://react-typescript-cheatsheet.netlify.app/)** - TypeScript cheatsheet

### UI/UX Resources
- **[Heroicons](https://heroicons.com/)** - Free SVG icons
- **[Lucide Icons](https://lucide.dev/)** - Icon library (used in project)
- **[Tailwind UI](https://tailwindui.com/)** - Premium UI components
- **[Headless UI](https://headlessui.com/)** - Accessible components

### Performance
- **[Web.dev](https://web.dev/)** - Performance best practices
- **[Lighthouse](https://developers.google.com/web/tools/lighthouse)** - Audit tool
- **[Next.js Analytics](https://vercel.com/analytics)** - Performance monitoring

### Community & Support
- **[Next.js Discord](https://discord.gg/nextjs)** - Official Discord
- **[React Discord](https://discord.gg/react)** - React community
- **[Tailwind Discord](https://discord.gg/tailwindcss)** - Tailwind community
- **[Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)** - Q&A

### Tools
- **[React DevTools](https://react.dev/learn/react-developer-tools)** - Browser extension
- **[Redux DevTools](https://github.com/reduxjs/redux-devtools)** - State debugging
- **[ESLint](https://eslint.org/)** - Linting
- **[Prettier](https://prettier.io/)** - Code formatting

---

## 🤝 Contributing

### Development Workflow

**1. Create Feature Branch:**
```bash
# Sync with main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Or fix branch
git checkout -b fix/bug-description
```

**2. Make Changes:**
```bash
# Follow code standards (see below)
# Write TypeScript
# Use Tailwind for styling
# Create reusable components

# Test locally
pnpm dev
# Verify feature works
```

**3. Commit Changes:**
```bash
# Use Conventional Commits format
git add .
git commit -m "feat(board): add drag and drop support"
git commit -m "fix(auth): resolve token expiration bug"
git commit -m "docs(setup): update installation guide"
git commit -m "style(ui): improve button hover states"
git commit -m "refactor(hooks): simplify useBoards hook"
```

**Commit Types:**
- `feat:` ✨ New features
- `fix:` 🐛 Bug fixes
- `docs:` 📚 Documentation
- `style:` 💄 Code style (formatting, no logic change)
- `refactor:` ♻️ Code refactoring
- `perf:` ⚡ Performance improvements
- `test:` 🧪 Adding tests
- `chore:` 🔧 Maintenance (deps, config)

**4. Push and Create PR:**
```bash
# Push branch
git push origin feature/your-feature-name

# Go to GitHub → Pull Requests → New PR
# Fill out PR template:
# - Description of changes
# - Screenshots (if UI change)
# - Testing steps
# - Related issues
```

**5. Code Review:**
```bash
# Address review comments
# Make changes
git add .
git commit -m "fix: address PR feedback"
git push origin feature/your-feature-name

# PR auto-updates
```

### Code Standards

**TypeScript:**
```typescript
// ✅ Do: Use TypeScript for all new files
interface User {
  id: string
  name: string
  email: string
}

// ✅ Do: Export types
export type { User }

// ✅ Do: Use type inference
const user = getUser() // TypeScript infers type

// ❌ Don't: Use `any`
const data: any = getData() // Use proper type instead
```

**Component Structure:**
```typescript
// ✅ Do: Use functional components
export default function Button({ children }: { children: React.ReactNode }) {
  return <button>{children}</button>
}

// ✅ Do: Define props interface
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
}

export default function Button({ variant = 'primary', ...props }: ButtonProps) {
  // ...
}

// ✅ Do: Use TypeScript for event handlers
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault()
  // ...
}
```

**Naming Conventions:**
```typescript
// ✅ Components: PascalCase
Button.tsx
KanbanBoard.tsx

// ✅ Hooks: camelCase starting with 'use'
useAuth.ts
useBoards.ts

// ✅ Utils/services: camelCase
api.ts
formatDate.ts

// ✅ Types: PascalCase
interface User {}
type BoardStatus = 'active' | 'archived'

// ✅ Constants: UPPER_SNAKE_CASE
const API_BASE_URL = '...'
const MAX_RETRIES = 3
```

**File Organization:**
```typescript
// ✅ Imports order:
// 1. React/Next.js
import React from 'react'
import Link from 'next/link'

// 2. External libraries
import axios from 'axios'
import { DndContext } from '@dnd-kit/core'

// 3. Internal components
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

// 4. Types
import type { User } from '@/types'

// 5. Styles (if any)
import styles from './Button.module.css'
```

**Styling (Tailwind):**
```typescript
// ✅ Do: Use Tailwind utility classes
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
  Click me
</button>

// ✅ Do: Use clsx for conditional classes
import clsx from 'clsx'

<button className={clsx(
  'px-4 py-2 rounded-lg',
  variant === 'primary' && 'bg-blue-500 text-white',
  variant === 'secondary' && 'bg-gray-200 text-gray-800',
  disabled && 'opacity-50 cursor-not-allowed'
)}>

// ✅ Do: Responsive design (mobile-first)
<div className="w-full md:w-1/2 lg:w-1/3">
  Mobile full width, tablet half, desktop third
</div>

// ❌ Don't: Inline styles (unless dynamic)
<div style={{ color: 'red' }}> // Use className instead
```

**Accessibility:**
```typescript
// ✅ Do: Use semantic HTML
<button> not <div onClick>
<nav> for navigation
<main> for main content

// ✅ Do: Add ARIA labels
<button aria-label="Close modal">×</button>

// ✅ Do: Support keyboard navigation
onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}

// ✅ Do: Use alt text for images
<img src="..." alt="Board preview" />
```

**Performance:**
```typescript
// ✅ Do: Use React.memo for expensive components
export default React.memo(KanbanBoard)

// ✅ Do: Use useMemo/useCallback
const sortedBoards = useMemo(() => {
  return boards.sort((a, b) => ...)
}, [boards])

// ✅ Do: Lazy load heavy components
const BoardDetail = dynamic(() => import('./BoardDetail'), {
  loading: () => <SkeletonBoardDetail />
})

// ✅ Do: Optimize images
import Image from 'next/image'
<Image src="..." width={500} height={300} alt="..." />
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test:
1. Step 1
2. Step 2
3. Expected result

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console errors
- [ ] Tested on mobile/tablet/desktop
```

---

## 🎯 Performance Optimization

### Build Optimization

**Analyze Bundle Size:**
```bash
# Install bundle analyzer
pnpm add -D @next/bundle-analyzer

# Update next.config.ts:
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

# Run analysis
ANALYZE=true pnpm build
# Opens bundle visualization in browser
```

**Code Splitting:**
```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic'

const BoardDetail = dynamic(() => import('@/components/board/BoardPageClient'), {
  loading: () => <SkeletonBoardDetail />,
  ssr: false // Client-side only
})
```

**Image Optimization:**
```typescript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src="/board-preview.jpg"
  alt="Board preview"
  width={800}
  height={600}
  priority // LCP image
  placeholder="blur"
  blurDataURL="data:image/..." // Low-res placeholder
/>
```

### Runtime Optimization

**Memoization:**
```typescript
// Expensive calculations
const sortedBoards = useMemo(() => {
  return boards.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}, [boards])

// Event handlers
const handleDragEnd = useCallback((event) => {
  // Drag logic
}, [cards]) // Only recreate if cards change
```

**Virtualization:**
```typescript
// For long lists (100+ items)
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={boards.length}
  itemSize={120}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <BoardCard board={boards[index]} />
    </div>
  )}
</FixedSizeList>
```

**Debouncing:**
```typescript
// Search input
import { useDebouncedCallback } from 'use-debounce'

const handleSearch = useDebouncedCallback((value: string) => {
  searchBoards(value)
}, 300) // Wait 300ms after typing stops
```

---

**✨ Happy Coding!** 

For issues not covered here:
- Check [GitHub Issues](https://github.com/yourusername/trello-app/issues)
- Ask in [Discussions](https://github.com/yourusername/trello-app/discussions)
- Review [Troubleshooting](#-troubleshooting) section

---

<div align="center">

**Built with ❤️ using Next.js 15, React 19, and TypeScript**

[⭐ Star this repo](https://github.com/yourusername/trello-app) • [🐛 Report Bug](https://github.com/yourusername/trello-app/issues) • [💡 Request Feature](https://github.com/yourusername/trello-app/issues)

**Version**: 1.0.0 | **Last Updated**: January 2025

</div>