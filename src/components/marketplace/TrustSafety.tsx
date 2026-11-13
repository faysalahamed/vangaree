"use client";

import { ShieldCheck, Flag, UserCheck, Lock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function TrustSafety() {
  const { t } = useLanguage();

  const POINTS = [
    { 
      icon: UserCheck, 
      title: t("trust_1_title"), 
      body: t("trust_1_desc") 
    },
    { 
      icon: Lock, 
      title: t("trust_2_title"), 
      body: t("trust_2_desc") 
    },
    { 
      icon: ShieldCheck, 
      title: t("trust_3_title"), 
      body: t("trust_3_desc") 
    },
    { 
      icon: Flag, 
      title: t("trust_4_title"), 
      body: t("trust_4_desc") 
    }
  ];

  return (
    <section className="px-4 md:px-12 py-16 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            {t("trust_badge")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 mb-3">
            {t("trust_title")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t("trust_1_desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POINTS.map(({ icon: Icon, title, body }) => (
            <div 
              key={title} 
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex p-3 rounded-xl bg-sky-50 text-sky-600 mb-4 border border-sky-100">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
