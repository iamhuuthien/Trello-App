// src/app/layout.tsx
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import ClientGuard from "../components/layout/ClientGuard";
import LayoutRenderer from "../components/layout/LayoutRenderer";
import { ToastProvider } from "../context/ToastContext";
import ConfirmProvider from "@/components/ui/ConfirmProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-800">
        <AuthProvider>
          <ToastProvider>
            <ClientGuard>
              <ConfirmProvider>
                <LayoutRenderer>{children}</LayoutRenderer>
              </ConfirmProvider>
            </ClientGuard>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
