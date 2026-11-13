"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Lock, Eye, EyeOff, LogIn, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { language, t } = useLanguage();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await signIn("credentials", { 
      phone: phone.trim(), 
      password, 
      redirect: false 
    });

    setSubmitting(false);

    if (result?.error) {
      setError(t("login_error_invalid"));
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    /* Outer Page Canvas (Background: sampled exact light sky-blue #ddf1fd from design reference) */
    <div className="bg-[#ddf1fd] min-h-[calc(100vh-100px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Login Card Section with #cbe2f8 border and #eaf4fe header banner */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#cbe2f8] shadow-xl overflow-hidden">
        
        {/* Card Header Banner (#eaf4fe) */}
        <div className="bg-[#eaf4fe] px-6 py-6 border-b border-[#cbe2f8] flex flex-col items-center text-center">
          {/* Official Vangare Logo */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-md border-2 border-sky-300 p-1 bg-white mb-3 transition-transform hover:scale-105 duration-300">
            <Image
              src="/logo.jpg"
              alt="Vangare Logo"
              fill
              priority
              className="object-cover rounded-full"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white text-[#0369a1] text-xs font-bold mb-1.5 border border-sky-200 shadow-xs">
            <Sparkles className="h-3 w-3 text-[#0284c7]" />
            <span>vangare.site</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t("login_page_title")}
          </h1>

          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            {t("login_page_subtitle")}
          </p>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 bg-white flex flex-col items-center">

          {/* Error Alert */}
          {error && (
            <div className="w-full mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 text-left shadow-xs">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-left">
            
            {/* Phone Field */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5" htmlFor="phone">
                {t("login_phone_label")}
              </label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("login_phone_placeholder")}
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-[#cbd5e1] text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none hover:border-sky-400 hover:shadow-xs focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5" htmlFor="password">
                {t("login_pass_label")}
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("login_pass_placeholder")}
                  required
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-white border border-[#cbd5e1] text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none hover:border-sky-400 hover:shadow-xs focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 text-slate-400 hover:text-sky-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] active:scale-[0.98] text-white font-extrabold text-sm shadow-md shadow-sky-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>{submitting ? t("login_submitting") : t("login_btn")}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Demo Credentials Helper Pill */}
          <div className="w-full mt-5 p-3 rounded-xl bg-sky-50/60 border border-sky-200 text-slate-600 text-[11px] leading-relaxed">
            <span className="font-semibold text-[#0369a1] block mb-0.5">
              💡 {language === "bn" ? "টেস্ট লগইন তথ্য:" : "Demo Credentials:"}
            </span>
            <span>{t("login_demo_hint")}</span>
          </div>

          {/* Register Navigation Link */}
          <div className="mt-5 pt-4 border-t border-slate-100 w-full text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-1.5">
            <span>{t("login_no_account")}</span>
            <Link
              href="/register"
              className="font-bold text-[#0284c7] hover:text-[#0369a1] hover:underline transition-colors"
            >
              {t("login_register_link")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
