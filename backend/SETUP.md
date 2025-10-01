# 🚀 Backend Setup Guide

A comprehensive guide to set up and run the TrelloApp backend server. This REST API is built with Express.js, Firebase Admin SDK, and modern Node.js practices.

---

## 📋 Tech Stack & Architecture

### Core Technologies
- **Runtime**: [Node.js](https://nodejs.org/) 18.x/20.x LTS
- **Framework**: [Express.js](https://expressjs.com/) 5.1.0 - Fast web framework
- **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore) - NoSQL document database
- **Authentication**: [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) + [JWT](https://jwt.io/)
- **Email Service**: [SendGrid](https://sendgrid.com/) / [Nodemailer](https://nodemailer.com/)
- **Validation**: [Express Validator](https://express-validator.github.io/) 7.2.1
- **Package Manager**: [pnpm](https://pnpm.io/) 10.17.1

### Architecture Pattern
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   REST API       │───▶│   Firestore     │
│   (Next.js)     │    │   (Express.js)   │    │   Database      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   SendGrid API   │
                       │   (Email)        │
                       └──────────────────┘
```

**API Design**: RESTful endpoints with JWT-based authentication
**Data Flow**: Frontend ↔ Express Controllers ↔ Services ↔ Firestore Collections

---

## 🔧 Prerequisites

### Required Software
| Tool | Version | Check Command | Install |
|------|---------|---------------|---------|
| **Node.js** | 18.x/20.x LTS | `node --version` | [nodejs.org](https://nodejs.org/) |
| **pnpm** | 7.0+ | `pnpm --version` | `npm install -g pnpm` |
| **Git** | Latest | `git --version` | [git-scm.com](https://git-scm.com/) |

### Optional Tools
- **Firebase CLI**: `npm install -g firebase-tools` (for emulator)
- **Postman/Insomnia**: API testing
- **VS Code**: Recommended editor with extensions

---

## ⚡ Quick Start

### 1. Installation
```bash
# Navigate to backend directory
cd path/to/Trello-App/backend

# Install dependencies
pnpm install

# Verify installation
pnpm list --depth=0
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit configuration (see Environment Variables section below)
code .env  # or nano .env
```

### 3. Firebase Setup (Choose One)

#### Option A: Local Development (Recommended)
```bash
# Start Firebase emulators
pnpm run emulators:start

# In new terminal, set emulator environment
# Windows PowerShell:
$env:USE_FIRESTORE_EMULATOR="1"
$env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
$env:FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"

# macOS/Linux:
export USE_FIRESTORE_EMULATOR="1"
export FIRESTORE_EMULATOR_HOST="127.0.0.1:8080"
export FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"

# Seed demo data
pnpm run seed
```

#### Option B: Production Firebase
```bash
# Set service account path
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
# OR configure FIREBASE_* variables in .env
```

### 4. Start Development Server
```bash
# Start with hot reload
pnpm run dev

# Production mode
pnpm start
```

### 5. Verify Setup
```bash
# Health check
curl http://localhost:4001/health
# Expected: {"ok":true}

# Test authentication endpoint
curl -X POST http://localhost:4001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## 🔐 Environment Variables

### Core Configuration
```env
# Server
PORT=4001                              # API server port

# Authentication
JWT_SECRET=your_super_secure_secret_key_here_32_chars_min

# Firebase Project
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

### Email Configuration
```env
# SendGrid (Recommended)
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SMTP_FROM="noreply@yourdomain.com"     # Must be verified sender

# Alternative: SMTP (Optional)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

### Development Options
```env
# Firebase Emulator (Local Development)
USE_FIRESTORE_EMULATOR=1
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099

# Testing
TEST_RECEIVER=your-test-email@example.com
```

### 🔑 Firebase Private Key Setup
The `FIREBASE_PRIVATE_KEY` must be properly escaped for .env format:

**PowerShell (Windows):**
```powershell
# Convert JSON service account to escaped private key
$json = Get-Content -Raw "path\to\service-account.json" | ConvertFrom-Json
$escaped = $json.private_key -replace "`n", "\\n"
Write-Output "FIREBASE_PRIVATE_KEY=`"$escaped`""
```

**Bash (macOS/Linux):**
```bash
# Extract and escape private key
PRIVATE_KEY=$(jq -r .private_key service-account.json | sed ':a;N;$!ba;s/\n/\\n/g')
echo "FIREBASE_PRIVATE_KEY=\"$PRIVATE_KEY\""
```

---

## 📝 Available Scripts

| Command | Description | Usage |
|---------|-------------|-------|
| `pnpm run dev` | Start development server with hot reload | Development |
| `pnpm start` | Start production server | Production |
| `pnpm run seed` | Seed database with demo data | Setup |
| `pnpm run emulators:start` | Start Firebase emulators | Local dev |

---

## 🗂️ Project Structure

```
backend/
├── 📁 controllers/          # Route handlers
│   ├── boardsController.js  # Board CRUD operations
│   ├── cardsController.js   # Card management
│   ├── tasksController.js   # Task operations
│   └── inviteController.js  # Invitation system
├── 📁 middleware/           # Express middleware
│   └── auth.js             # JWT authentication
├── 📁 routes/              # API route definitions
│   ├── auth.js             # Authentication routes
│   └── boards.js           # Board-related routes
├── 📁 services/            # Business logic layer
│   ├── boardService.js     # Board operations
│   ├── cardService.js      # Card operations
│   ├── taskService.js      # Task operations
│   └── inviteService.js    # Invitation logic
├── 📁 scripts/             # Utility scripts
│   ├── seedFirestore.js    # Database seeding
│   ├── seed_two_users_and_tokens.js  # Demo users
│   └── migrateUserIds.js   # Data migration
├── 📄 index.js             # Application entry point
├── 📄 package.json         # Dependencies & scripts
├── 📄 .env.example         # Environment template
└── 📄 firebase.json        # Firebase configuration
```

---

## 🔌 API Endpoints

### Authentication
```http
POST /auth/signup           # Send verification code to email
POST /auth/signin           # Verify code and get JWT token
```

### Boards
```http
GET    /boards              # List user's boards
POST   /boards              # Create new board
GET    /boards/:id          # Get board details
PUT    /boards/:id          # Update board
DELETE /boards/:id          # Delete board
POST   /boards/:id/columns  # Add column to board
```

### Cards
```http
GET    /boards/:boardId/cards                    # List cards in board
POST   /boards/:boardId/cards                    # Create new card
GET    /boards/:boardId/cards/:id                # Get card details
PUT    /boards/:boardId/cards/:id                # Update card
DELETE /boards/:boardId/cards/:id                # Delete card
GET    /boards/:boardId/cards/user/:user_id      # Get user's cards
```

### Tasks
```http
GET    /boards/:boardId/cards/:cardId/tasks                     # List tasks
POST   /boards/:boardId/cards/:cardId/tasks                     # Create task
GET    /boards/:boardId/cards/:cardId/tasks/:taskId             # Get task
PUT    /boards/:boardId/cards/:cardId/tasks/:taskId             # Update task
DELETE /boards/:boardId/cards/:cardId/tasks/:taskId             # Delete task
POST   /boards/:boardId/cards/:cardId/tasks/:taskId/assign      # Assign member
DELETE /boards/:boardId/cards/:cardId/tasks/:taskId/assign      # Remove assignment
```

---

## 🧪 Testing & Development

### Manual API Testing
```bash
# 1. Get authentication token
curl -X POST http://localhost:4001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 2. Use verification code from email/console
curl -X POST http://localhost:4001/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456"}'

# 3. Use returned JWT token for authenticated requests
curl -X GET http://localhost:4001/boards \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Using Demo Tokens
```bash
# Run seed script to create demo users
pnpm run seed

# Check seed_tokens.json for ready-to-use JWT tokens
cat seed_tokens.json
```

### Database Seeding
The seeding process creates:
- ✅ Demo users with proper IDs
- ✅ Sample boards with different owners
- ✅ Cards with various statuses
- ✅ Tasks with assignments
- ✅ JWT tokens for immediate API testing

---

## 🚨 Troubleshooting

### Common Issues

#### ❌ Firebase Authentication Errors
```bash
# Problem: "Firebase Admin SDK not initialized"
# Solution: Check environment variables
echo $GOOGLE_APPLICATION_CREDENTIALS
# OR verify FIREBASE_* variables in .env
```

#### ❌ Private Key Parse Errors
```bash
# Problem: "Invalid private key format"
# Solution: Ensure proper escaping in .env
# The key should be: "-----BEGIN PRIVATE KEY-----\nMIIE....\n-----END PRIVATE KEY-----\n"
```

#### ❌ Email Sending Failures
```bash
# Problem: Email not sending
# Solutions:
# 1. Verify SendGrid API key and verified sender
# 2. Check SMTP_FROM matches verified email in SendGrid
# 3. For development, emails use Ethereal (check console for preview URL)
```

#### ❌ Port Already in Use
```bash
# Problem: EADDRINUSE :::4001
# Solution: Kill existing process or change port
lsof -ti:4001 | xargs kill -9
# OR change PORT in .env
```

#### ❌ Emulator Connection Issues
```bash
# Problem: Can't connect to Firestore emulator
# Solution: Ensure emulator is running and environment variables are set
firebase emulators:start --only firestore,auth
# Check http://localhost:4001/health shows Firebase connection
```

### Debug Mode
```bash
# Enable detailed logging
DEBUG=* pnpm run dev

# Check Firestore connection
curl http://localhost:4001/health
```

---

## 🚀 Deployment

### Production Checklist
- [ ] Strong `JWT_SECRET` (32+ characters)
- [ ] Valid Firebase service account with proper permissions
- [ ] SendGrid API key configured with verified sender domain
- [ ] Environment variables set in hosting platform
- [ ] `NODE_ENV=production`
- [ ] Remove `USE_FIRESTORE_EMULATOR` from production environment

### Platform-Specific

#### Heroku
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secure_secret
heroku config:set FIREBASE_PROJECT_ID=your_project_id
# ... other environment variables
```

#### Vercel
```bash
vercel env add JWT_SECRET
vercel env add FIREBASE_PROJECT_ID
# Configure through Vercel dashboard or CLI
```

#### Railway/Render
Set environment variables through platform dashboard.

---

## 🔒 Security Best Practices

### Environment Security
- ✅ Never commit `.env` or service account JSON files
- ✅ Use strong, randomly generated JWT secrets (32+ chars)
- ✅ Rotate Firebase service account keys regularly
- ✅ Use environment-specific configurations

### API Security
- ✅ JWT tokens expire in 7 days (configurable)
- ✅ Email verification codes expire in 15 minutes
- ✅ Input validation on all endpoints
- ✅ CORS properly configured
- ✅ Authentication required for all protected routes

### Firebase Security
- ✅ Firestore security rules configured
- ✅ Service account has minimal required permissions
- ✅ Admin SDK operations are server-side only

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Firebase Admin SDK Guide](https://firebase.google.com/docs/admin/setup)
- [SendGrid API Documentation](https://docs.sendgrid.com/)
- [JWT.io - Token Debugger](https://jwt.io/)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

## 🤝 Contributing

1. Follow [Conventional Commits](https://www.conventionalcommits.org/)
2. Test all endpoints before submitting PR
3. Update this documentation for any new environment variables
4. Ensure Firebase emulator tests pass

---

**✨ Happy Coding!** If you encounter issues not covered here, check the troubleshooting section or create an issue.