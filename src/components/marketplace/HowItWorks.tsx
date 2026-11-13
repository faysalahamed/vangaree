"use client";

import Link from "next/link";
import { Camera, SearchCheck, MessageCircle, Handshake, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HowItWorks() {
  const { language, t } = useLanguage();

  const STEPS = [
    { 
      step: "01",
      icon: Camera, 
      title: t("step_1_title"), 
      body: t("step_1_desc") 
    },
    { 
      step: "02",
      icon: SearchCheck, 
      title: t("step_2_title"), 
      body: t("step_2_desc") 
    },
    { 
      step: "03",
      icon: MessageCircle, 
      title: t("step_3_title"), 
      body: t("step_3_desc") 
    },
    { 
      step: "04",
      icon: Handshake, 
      title: t("step_4_title"), 
      body: t("step_4_desc") 
    }
  ];

  return (
    <section className="px-4 md:px-12 py-16 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            {t("how_it_works_badge")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 mb-3">
            {t("how_it_works_title")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {language === "bn"
              ? "ভাঙারি সাইটে আপনার নষ্ট ডিভাইস দিয়ে অন্য কাউকে সাহায্য করুন এবং নিজের ডিভাইস মেরামত করুন।"
              : "Whether you need a donor part to revive your phone or want to cash in on a broken device, here is how it works."}
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map(({ step, icon: Icon, title, body }) => (
            <div 
              key={step} 
              className="relative flex flex-col p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-sky-400 hover:shadow-lg transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black text-slate-300 group-hover:text-sky-600 transition-colors">
                  {step}
                </span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-200 group-hover:bg-sky-600 group-hover:text-white transition-colors text-sky-600">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                {title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>

        {/* Call to action bar */}
        <div className="mt-12 text-center">
          <Link
            href="/post-ad"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm transition-colors shadow-sm"
          >
            {t("header_post_ad")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
