"use client";

import { useEffect } from "react";

function getSessionId() {
  const key = "vangare_session_id";
  let id = typeof window !== "undefined" ? localStorage.getItem(key) : null;
  if (!id) {
    id = crypto.randomUUID();
    if (typeof window !== "undefined") localStorage.setItem(key, id);
  }
  return id;
}

export default function ViewLogger({
  listingId,
  partType,
  phoneBrand
}: {
  listingId: string;
  partType: string;
  phoneBrand: string;
}) {
  useEffect(() => {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: getSessionId(),
        eventType: "VIEW",
        listingId,
        partType,
        phoneBrand
      })
    }).catch(() => {
      // Tracking is best-effort — never block the page on it.
    });
  }, [listingId, partType, phoneBrand]);

  return null;
}
