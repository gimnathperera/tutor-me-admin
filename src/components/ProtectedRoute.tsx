"use client";

import { useAuthContext } from "@/context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const publicRoutes = ["/signin", "/signup", "/reset-password"];

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoaded } = useAuthContext();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (isUserLoaded) {
      const currentPath = window.location.pathname;

      if (!user && !publicRoutes.includes(currentPath)) {
        router.push("/signin");
        setHasRedirected(true);
      }
      else if (user && user.role !== "admin") {
        router.push("/403");
        setHasRedirected(true);
      } else if (
        user &&
        user.role === "admin" &&
        publicRoutes.includes(currentPath)
      ) {
        router.push("/");
        setHasRedirected(true);
      }
      else {
        setHasRedirected(false);
      }
    }
  }, [isUserLoaded, user, router]);

  if (isUserLoaded && !hasRedirected) {
    return <>{children}</>;
  }

  return null;
}