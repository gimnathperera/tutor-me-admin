"use client";

import { useAuthContext } from "@/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const publicRoutes = ["/signin", "/signup", "/reset-password"];

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoaded } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoaded) return;

    const currentPath = window.location.pathname;

    if (!user && !publicRoutes.includes(currentPath)) {
      // Not authenticated — redirect to sign in
      router.replace("/signin");
    } else if (user && user.role !== "admin") {
      // Authenticated but not admin — forbidden
      router.replace("/403");
    } else if (user && user.role === "admin" && publicRoutes.includes(currentPath)) {
      // Already logged in admin trying to visit /signin — redirect to dashboard
      router.replace("/");
    }
  }, [isUserLoaded, user, router]);

  // While auth state is resolving, show a fullscreen loading indicator
  if (!isUserLoaded) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--color-gray-900, #111827)",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: "4px solid rgba(255,255,255,0.15)",
            borderTopColor: "#6366f1",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
