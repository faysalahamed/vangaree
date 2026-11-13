"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function ListingsPageHeader() {
  const { t } = useLanguage();

  return (
    <div className="mb-6">
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        {t("listings_page_title")}
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 mt-1">
        {t("listings_page_subtitle")}
      </p>
    </div>
  );
}
