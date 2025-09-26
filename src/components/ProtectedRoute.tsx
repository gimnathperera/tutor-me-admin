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
      router.replace("/signin");
    } else if (user && user.role !== "admin") {
      router.replace("/403");
    } else if (
      user &&
      user.role === "admin" &&
      publicRoutes.includes(currentPath)
    ) {
      router.replace("/");
    }
  }, [isUserLoaded, user, router]);

  if (!isUserLoaded) {
    return null;
  }

  return <>{children}</>;
}
