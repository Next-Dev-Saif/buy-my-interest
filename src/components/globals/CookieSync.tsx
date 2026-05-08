"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { checkProfileCompletion } from "@/utils/profile-check";
import { setAuthCookie } from "@/utils/auth-cookies";
import { parseCookies } from "nookies";

export default function CookieSync() {
  const { user } = useAuth();

  useEffect(() => {
    const syncCookies = async () => {
      if (!user?.email) return;

      const cookies = parseCookies();
      const hasToken = !!cookies["auth-token"];
      const hasRole = !!cookies["user-role"];
      const hasProfile = !!cookies["profile-completed"];

      // If we're logged in but missing critical security cookies, re-sync from DB
      if (hasToken && (!hasRole || !hasProfile)) {
        console.log("CookieSync: Security cookies missing, re-syncing from DB...");
        try {
          const profile = await checkProfileCompletion(user.email, user.uid);
          if (profile) {
            await setAuthCookie(undefined, !!profile.completed, user.email, profile.userType);
            console.log("CookieSync: Successfully restored security context.");
          }
        } catch (error) {
          console.error("CookieSync: Sync failed:", error);
        }
      }
    };

    syncCookies();
  }, [user]);

  return null;
}
