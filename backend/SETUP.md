# Backend setup (ngắn)

Yêu cầu
- Node >= 18
- pnpm (đã dùng pnpm trong repo)

Bước thực hiện (Windows PowerShell)
1. Mở terminal tại thư mục backend:
   cd c:\TrelloApp\Trello-App\backend

2. Cài dependencies:
   pnpm install

3. Tạo file env:
   copy .env.example .env
   // Mở .env và điền các biến cần thiết (SERVICE_ACCOUNT_JSON, FIREBASE_* , JWT_SECRET, SMTP_* ...)

4. Chạy dev:
   pnpm run dev

Hoặc (Linux / macOS)
- cp .env.example .env
- pnpm install
- pnpm run dev

Variables cần cấu hình (ví dụ)
- PORT=4000
- JWT_SECRET=your_jwt_secret
- FIREBASE_PROJECT_ID=...
- FIREBASE_CLIENT_EMAIL=...
- FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS

Ghi chú
- Nếu chưa có file index.js, tạo entry server (ví dụ server sử dụng express).
- Nếu sử dụng Firebase Admin, lưu service account hoặc set env vars theo trên.
- Để deploy, chạy `pnpm run start` (production).