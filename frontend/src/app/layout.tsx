// src/app/layout.tsx
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import ClientGuard from "../components/layout/ClientGuard";
import LayoutRenderer from "../components/layout/LayoutRenderer";
import { ToastProvider } from "../context/ToastContext";
import ConfirmProvider from "@/components/ui/ConfirmProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Make html attributes deterministic between server and client to avoid hydration mismatch.
    // Explicitly include the class that was present in the server-rendered HTML ("mdl-js")
    // so client and server output match on first render.
    <html lang="en" className="mdl-js">
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
