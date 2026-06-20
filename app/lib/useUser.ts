"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  plan: string;
}

/**
 * Loads the current user from the session cookie via /api/auth/me.
 * Redirects to /login on 401 when `redirectOnUnauth` is set.
 */
export function useUser(redirectOnUnauth = true) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch(() => {
        if (active && redirectOnUnauth) router.replace("/login");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [router, redirectOnUnauth]);

  return { user, loading, setUser };
}
