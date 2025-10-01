
# 📋 TrelloApp - Modern Task Management System

A powerful and intuitive task management application built with Next.js, Firebase, and modern web technologies. Organize your projects with Kanban boards, real-time collaboration, and seamless user experience.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-13.5.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Express.js](https://img.shields.io/badge/Express.js-5.1.0-000000?style=for-the-badge&logo=express&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)

## ✨ Features

- 🔐 **Email-based Authentication** - Secure login with verification codes
- 📊 **Kanban Boards** - Drag-and-drop task management with customizable columns
- ⚡ **Real-time Collaboration** - Live updates across all connected users
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI/UX** - Clean, intuitive interface with smooth animations
- 📝 **Task Management** - Create, edit, assign, and track tasks with priorities
- 👥 **Team Collaboration** - Invite members and manage board permissions
- 🔄 **Drag & Drop** - Intuitive task movement between columns
- 🔍 **Search & Filter** - Quickly find boards, cards, and team members
- 📧 **Email Notifications** - Stay updated with SendGrid integration
- 🏗️ **Project Structure** - Organized codebase with TypeScript support

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library with latest features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[DndKit](https://dndkit.com/)** - Modern drag and drop toolkit
- **[Lucide React](https://lucide.dev/)** - Beautiful SVG icons

### Backend
- **[Express.js 5](https://expressjs.com/)** - Fast, minimalist web framework
- **[Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)** - Server-side Firebase integration
- **[JSON Web Tokens](https://jwt.io/)** - Secure authentication
- **[SendGrid](https://sendgrid.com/)** - Reliable email delivery
- **[Express Validator](https://express-validator.github.io/)** - Input validation middleware

### Database & Services
- **[Cloud Firestore](https://firebase.google.com/docs/firestore)** - NoSQL document database
- **[Firebase Auth](https://firebase.google.com/docs/auth)** - User authentication
- **[Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)** - Local development environment

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** 18.x or 20.x (LTS recommended)
- **pnpm** 7+ (recommended package manager)
- **Firebase CLI** (optional, for emulator)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/trello-app.git
cd trello-app

# Install dependencies for both frontend and backend
cd frontend && pnpm install
cd ../backend && pnpm install

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Configure your Firebase project and SendGrid API key in .env files

# Start Firebase emulator (recommended for development)
cd backend && pnpm run emulators:start

# In a new terminal, seed the database
cd backend && pnpm run seed

# Start the backend server
cd backend && pnpm run dev

# In another terminal, start the frontend
cd frontend && pnpm dev
```

### Environment Configuration

**Backend (.env)**
```env
PORT=4001
JWT_SECRET=your_jwt_secret_here
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
SENDGRID_API_KEY=your_sendgrid_api_key
SMTP_FROM="noreply@yourdomain.com"
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:4001
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 📖 Usage

1. **Sign Up/Sign In**: Use your email to receive a verification code
2. **Create Boards**: Start with a new project board
3. **Add Columns**: Customize your workflow (To Do, In Progress, Review, Done)
4. **Create Cards**: Add tasks with descriptions, priorities, and deadlines
5. **Drag & Drop**: Move cards between columns as work progresses
6. **Collaborate**: Invite team members and assign tasks
7. **Track Progress**: Monitor your project's status in real-time

## 📁 Project Structure

```
trello-app/
├── 📂 frontend/                 # Next.js application
│   ├── 📂 src/
│   │   ├── 📂 app/             # App Router pages
│   │   ├── 📂 components/      # Reusable UI components
│   │   │   ├── 📂 auth/        # Authentication components
│   │   │   ├── 📂 board/       # Board-related components
│   │   │   ├── 📂 layout/      # Layout components
│   │   │   └── 📂 ui/          # Generic UI components
│   │   ├── 📂 context/         # React contexts
│   │   ├── 📂 hooks/           # Custom React hooks
│   │   ├── 📂 services/        # API services
│   │   └── 📂 types/           # TypeScript type definitions
│   ├── 📄 package.json
│   └── 📄 tailwind.config.js
├── 📂 backend/                  # Express.js API server
│   ├── 📂 controllers/         # Route controllers
│   ├── 📂 middleware/          # Express middleware
│   ├── 📂 routes/              # API routes
│   ├── 📂 services/            # Business logic
│   ├── 📂 scripts/             # Database seeding scripts
│   ├── 📄 index.js             # Server entry point
│   └── 📄 package.json
├── 📄 README.md
└── 📄 LICENSE
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Development Workflow

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Make** your changes following our coding standards
5. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: add amazing new feature"
   git commit -m "fix: resolve drag and drop issue"
   git commit -m "docs: update installation guide"
   ```
6. **Push** to your branch: `git push origin feature/amazing-feature`
7. **Open** a Pull Request

### Commit Types
- `feat:` ✨ New features
- `fix:` 🐛 Bug fixes
- `docs:` 📚 Documentation changes
- `style:` 💄 Code style changes
- `refactor:` ♻️ Code refactoring
- `test:` 🧪 Adding tests
- `chore:` 🔧 Maintenance tasks

### Code Standards
- Use **TypeScript** for type safety
- Follow **ESLint** and **Prettier** configurations
- Write **descriptive commit messages**
- Add **JSDoc comments** for complex functions
- Ensure **responsive design** compatibility

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

<div align="center">

**Built with ❤️ by [Your Name](https://github.com/yourusername)**

[⭐ Star this repo](https://github.com/yourusername/trello-app) • [🐛 Report Bug](https://github.com/yourusername/trello-app/issues) • [💡 Request Feature](https://github.com/yourusername/trello-app/issues)

</div>

📸 **Về phần Screenshots:** Bạn có thể tạo folder `screenshots/` và thêm section này vào cuối README:

```md
## 📸 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Kanban Board
![Kanban Board](./screenshots/kanban-board.png)

### Task Management
![Task Management](./screenshots/task-management.png)

### Mobile View
![Mobile View](./screenshots/mobile-view.png)
```