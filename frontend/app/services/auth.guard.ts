// app/services/auth.guard.ts

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getUser, isAuthenticated } from "./token.service";

// Re-export AuthUser type for consistency across the app
export type { AuthUser } from "./token.service";

interface GuardOptions {
  allowedRoles?: string[];
}

export const useAuthGuard = (options?: GuardOptions) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  const checkAuth = useCallback(() => {
    const authenticated = isAuthenticated();

    // 🔒 1. If not authenticated → redirect to login
    if (!authenticated) {
      setAuthorized(false);
      router.replace("/login");
      return;
    }

    // 🔐 2. If role-based access is required
    if (options?.allowedRoles) {
      const user = getUser();
      const userRole = user?.role?.toUpperCase() || "";

      if (!user || !options.allowedRoles.includes(userRole)) {
        setAuthorized(false);
        // Redirect to a safe default page if they have a session but wrong role
        if (userRole === "SUPERVISOR") {
          router.replace("/report-download");
        } else {
          router.replace("/login");
        }
        return;
      }
    }

    setAuthorized(true);
  }, [router, options]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { authorized };
};
