// src/app/layout.tsx

import { Outfit } from "next/font/google";
import "./globals.css";

import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/auth-context";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { WithProviders } from "@/hocs/with-providers";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <WithProviders>
          <AuthProvider>
            <ProtectedRoute>
              <ThemeProvider>
                <SidebarProvider>{children}</SidebarProvider>
              </ThemeProvider>
            </ProtectedRoute>
          </AuthProvider>
        </WithProviders>
      </body>
    </html>
  );
}
