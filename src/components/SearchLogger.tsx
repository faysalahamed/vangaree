"use client";

import { useEffect, useRef } from "react";

function getSessionId() {
  const key = "vangare_session_id";
  let id = typeof window !== "undefined" ? localStorage.getItem(key) : null;
  if (!id) {
    id = crypto.randomUUID();
    if (typeof window !== "undefined") localStorage.setItem(key, id);
  }
  return id;
}

export default function SearchLogger({
  searchQuery,
  partType,
  phoneBrand,
  location
}: {
  searchQuery?: string;
  partType?: string;
  phoneBrand?: string;
  location?: string;
}) {
  const lastKey = useRef<string>("");

  useEffect(() => {
    const signature = JSON.stringify({ searchQuery, partType, phoneBrand, location });
    if (signature === lastKey.current) return;
    if (!searchQuery && !partType && !phoneBrand && !location) return;

    lastKey.current = signature;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: getSessionId(),
        eventType: "SEARCH",
        searchQuery: searchQuery || null,
        partType: partType || null,
        phoneBrand: phoneBrand || null,
        location: location || null,
        pageUrl: typeof window !== "undefined" ? window.location.pathname + window.location.search : "/listings",
        timezone
      })
    }).catch(() => {
      // Best-effort tracking
    });
  }, [searchQuery, partType, phoneBrand, location]);

  return null;
}
