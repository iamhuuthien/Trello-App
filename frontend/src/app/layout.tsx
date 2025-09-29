// src/app/layout.tsx
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import ClientGuard from "../components/layout/ClientGuard";
import LayoutRenderer from "../components/layout/LayoutRenderer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-800">
        <AuthProvider>
          <ClientGuard>
            <LayoutRenderer>{children}</LayoutRenderer>
          </ClientGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
