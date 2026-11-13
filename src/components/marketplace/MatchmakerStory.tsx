"use client";

import Link from "next/link";
import { 
  Repeat, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Sparkles 
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function MatchmakerStory() {
  const { language, t } = useLanguage();

  return (
    <section className="px-4 md:px-12 py-16 bg-gradient-to-br from-primary-900 via-primary-950 to-slate-900 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold mb-4">
            <Repeat className="h-3.5 w-3.5" />
            {t("matchmaker_badge")}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-4">
            {t("matchmaker_title_1")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-highlight to-emerald-400">
              {t("matchmaker_title_2")}
            </span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {t("matchmaker_desc")}
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-12">
          
          {/* Scenario A */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold mb-4">
                {language === "bn" ? "ব্যবহারকারী দৃশ্যপট ১" : "User Scenario A"}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t("scenario_a_title")}</h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                {t("scenario_a_desc")}
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-red-400">
                  <XCircle className="h-4 w-4 shrink-0" />
                  <span>{language === "bn" ? "শো-রুম মূল্য: ৳১২,০০০+ (অতিরিক্ত ব্যয়বহুল)" : "Showroom price: ৳12,000+ (Too costly)"}</span>
                </div>
                <div className="flex items-center gap-2 text-amber-300">
                  <XCircle className="h-4 w-4 shrink-0" />
                  <span>{language === "bn" ? "মার্কেট ডুপ্লিকেট: ৳৪,৫00 (খারাপ কোয়ালিটি)" : "Market copy: ৳4,500 (Poor color & lag)"}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold pt-1">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{language === "bn" ? "মাদারবোর্ড ও ব্যাটারি: সম্পূর্ণ সুস্থ" : "Motherboard & battery: 100% fine"}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 text-xs text-slate-400">
              {language === "bn" ? "প্রয়োজন: ১টি আসল ডোনার ডিসপ্লে" : "Needs: 1 Original Donor Display"}
            </div>
          </div>

          {/* Core Match */}
          <div className="rounded-3xl bg-gradient-to-b from-sky-600/30 to-primary-800/40 border-2 border-sky-400/50 p-6 sm:p-8 backdrop-blur-lg flex flex-col justify-between relative shadow-2xl">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 text-primary-950 text-xs font-black uppercase tracking-wider shadow-md">
              ⚡ {language === "bn" ? "ভাঙারি ম্যাচমেকার" : "Vangare Match"}
            </div>

            <div>
              <div className="text-center mb-6 mt-2">
                <div className="inline-flex p-3 rounded-2xl bg-white/10 text-sky-300 mb-3">
                  <Repeat className="h-7 w-7 animate-pulse" />
                </div>
                <h3 className="text-xl font-black text-white">
                  {language === "bn" ? "সরাসরি পার্টস বিনিময়" : "Direct Part Exchange"}
                </h3>
                <p className="text-xs text-slate-200 mt-1">
                  {language === "bn" ? "সরাসরি কথা বলুন এবং সঠিক দামে পার্টস বিনিময় বা ক্রয় করুন।" : "Agree on a direct part swap or purchase directly with the owner."}
                </p>
              </div>

              <div className="rounded-2xl bg-primary-950/60 p-4 border border-white/10 space-y-3 text-xs mb-6">
                <div className="flex items-center justify-between text-slate-200">
                  <span>{language === "bn" ? "পার্টস নির্ভরযোগ্যতা" : "Donor Authenticity"}</span>
                  <span className="font-bold text-emerald-400">{language === "bn" ? "১০০% আসল OEM" : "100% Original OEM"}</span>
                </div>
                <div className="flex items-center justify-between text-slate-200">
                  <span>{language === "bn" ? "গড় সাশ্রয়" : "Average Savings"}</span>
                  <span className="font-bold text-sky-300">{language === "bn" ? "৭০% পর্যন্ত কম খরচ" : "Up to 70% Saved"}</span>
                </div>
                <div className="flex items-center justify-between text-slate-200">
                  <span>{language === "bn" ? "পরিবেশে প্রভাব" : "Environmental Impact"}</span>
                  <span className="font-bold text-emerald-300">{language === "bn" ? "জিরো ই-বর্জ্য" : "Zero E-Waste"}</span>
                </div>
              </div>
            </div>

            <Link
              href="/post-ad"
              className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm text-center shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              {language === "bn" ? "ফ্রি বিজ্ঞাপন দিন" : "Post Your Broken Device Free"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Scenario B */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-4">
                {language === "bn" ? "ব্যবহারকারী দৃশ্যপট ২" : "User Scenario B"}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t("scenario_b_title")}</h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                {t("scenario_b_desc")}
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-red-400">
                  <XCircle className="h-4 w-4 shrink-0" />
                  <span>{language === "bn" ? "ড্রয়ারে অবহেলায় পড়ে আছে" : "Sitting idle in drawer unused"}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{language === "bn" ? "ডিসপ্লে: ১০০% অরিজিনাল ও নিখুঁত" : "Display: 100% factory original"}</span>
                </div>
                <div className="flex items-center gap-2 text-sky-300 font-semibold">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{language === "bn" ? "বিক্রি করে নগদ টাকা আয় সম্ভব!" : "Can be sold to Scenario A for cash!"}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 text-xs text-slate-400">
              {language === "bn" ? "আনুমানিক মূল্য: ৳ ২,০০০ - ৳ ৬,০০০" : "Value: ৳ 2,000 - ৳ 6,000"}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
