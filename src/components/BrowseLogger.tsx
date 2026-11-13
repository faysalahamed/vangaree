"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function getSessionId() {
  const key = "vangare_session_id";
  let id = typeof window !== "undefined" ? localStorage.getItem(key) : null;
  if (!id) {
    id = crypto.randomUUID();
    if (typeof window !== "undefined") localStorage.setItem(key, id);
  }
  return id;
}

export default function BrowseLogger() {
  const pathname = usePathname();
  const lastLoggedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    // Avoid logging the exact same route twice on re-renders
    if (lastLoggedPath.current === pathname) return;
    lastLoggedPath.current = pathname;

    // Skip logging internal or admin paths if desired, or log everything except api
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: getSessionId(),
        eventType: "VIEW",
        pageUrl: pathname,
        timezone
      })
    }).catch(() => {
      // Best-effort analytics
    });
  }, [pathname]);

  return null;
}
