"use client";

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/context/LanguageContext";
import BrowseLogger from "@/components/BrowseLogger";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <BrowseLogger />
        {children}
      </LanguageProvider>
    </SessionProvider>
  );
}
