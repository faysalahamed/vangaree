"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, MapPin, Globe, ShieldCheck, User as UserIcon, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { useLanguage } from "@/context/LanguageContext";
import NotificationBell from "@/components/NotificationBell";

const DIVISIONS = ["All Bangladesh", "Dhaka", "Chattogram", "Khulna", "Rajshahi", "Sylhet", "Barishal", "Rangpur", "Mymensingh"];

const DIVISIONS_BN: Record<string, string> = {
  "All Bangladesh": "সমগ্র বাংলাদেশ",
  "Dhaka": "ঢাকা",
  "Chattogram": "চট্টগ্রাম",
  "Khulna": "খুলনা",
  "Rajshahi": "রাজশাহী",
  "Sylhet": "সিলেট",
  "Barishal": "বরিশাল",
  "Rangpur": "রংপুর",
  "Mymensingh": "ময়মনসিংহ"
};

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { data: session, status } = useSession();
  const userRole = (session?.user as { role?: string } | undefined)?.role;

  // Dashboard and Admin pages use their own dedicated Sidebar + Top Bar layout
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#cbe2f8] bg-white shadow-xs">
      <div className="flex items-center gap-3 md:gap-4 px-4 md:px-12 py-3.5">
        
        {/* Brand Logo */}
        <Link href="/" className="shrink-0 text-xl font-extrabold flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-sm border border-sky-300 shrink-0">
            <Image src="/logo.jpg" alt="Vangare Logo" fill sizes="32px" className="object-cover" />
          </div>
          <div className="flex items-center">
            <span className="text-primary font-black tracking-tight text-2xl">vangare</span>
            <span className="text-sky-500 font-black text-2xl">.site</span>
          </div>
        </Link>

        {/* Search Bar on desktop */}
        <form
          action="/listings"
          className="hidden md:flex flex-1 max-w-2xl items-stretch rounded-lg border border-neutral-300 bg-neutral-100 p-1"
        >
          <div className="flex items-center gap-1.5 rounded-md bg-white border border-neutral-200 px-3 mr-1">
            <MapPin className="h-4 w-4 text-sky-600 shrink-0" />
            <select
              name="division"
              className="bg-transparent text-xs font-semibold text-primary-800 outline-none py-1 cursor-pointer"
              defaultValue="All Bangladesh"
            >
              {DIVISIONS.map((d) => (
                <option key={d} value={d}>
                  {language === "bn" ? DIVISIONS_BN[d] || d : d}
                </option>
              ))}
            </select>
          </div>
          <input
            name="q"
            aria-label={t("header_search_placeholder")}
            placeholder={t("header_search_placeholder")}
            className="flex-1 rounded-md bg-white border border-neutral-200 px-4 text-xs sm:text-sm text-primary-800 placeholder:text-neutral-400 outline-none mr-1 focus:border-sky-500"
          />
          <button
            type="submit"
            className="rounded-md bg-primary text-white px-4 flex items-center gap-1.5 text-xs font-semibold hover:bg-primary-600 transition-colors"
          >
            <Search className="h-3.5 w-3.5" /> {t("header_search_btn")}
          </button>
        </form>

        {/* Right Action Group */}
        <nav className="hidden md:flex items-center gap-3 ml-auto text-sm">
          
          {/* Admin Panel Quick Pill (Visible to ADMIN users) */}
          {userRole === "ADMIN" && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-black transition-all shadow-xs"
              title="অ্যাডমিন ড্যাশবোর্ড"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
              <span>Admin Panel</span>
            </Link>
          )}

          {/* Language Switcher Pill */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-300 transition-all shadow-sm"
            title="বাংলা / English পরিবর্তন করুন"
          >
            <Globe className="h-3.5 w-3.5 text-sky-600" />
            <span>{language === "bn" ? "English" : "বাংলা"}</span>
          </button>

          <Button asChild size="sm" variant="outline">
            <Link href="/listings">{t("header_find_parts")}</Link>
          </Button>
          
          <span className="h-5 w-px bg-neutral-200" aria-hidden="true" />
          
          {/* User Auth Info */}
          {status === "authenticated" ? (
            <div className="flex items-center gap-2">
              <NotificationBell />
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-sky-50 text-slate-800 hover:text-sky-600 border border-slate-200 text-xs font-bold transition-all shadow-xs"
                title="আমার ড্যাশবোর্ড"
              >
                <UserIcon className="h-3.5 w-3.5 text-sky-600" />
                <span>{session.user?.name?.split(" ")[0]}</span>
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-[11px] text-slate-400 hover:text-red-600 font-semibold transition-colors"
                title="লগআউট"
              >
                (লগআউট)
              </button>
            </div>
          ) : (
            <Link href="/login" className="font-semibold text-primary-800 hover:text-sky-600 text-xs sm:text-sm">
              {t("header_login")}
            </Link>
          )}
          
          <Button asChild size="sm" variant="accent">
            <Link href="/post-ad">{t("header_post_ad")}</Link>
          </Button>
        </nav>

        {/* Mobile Language Switcher + Notification + Hamburger */}
        <div className="flex items-center gap-2 md:hidden ml-auto">
          {status === "authenticated" && <NotificationBell />}

          {userRole === "ADMIN" && (
            <Link
              href="/admin"
              className="p-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-xs"
              title="Admin"
            >
              <ShieldCheck className="h-4 w-4" />
            </Link>
          )}

          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <Globe className="h-3 w-3 text-sky-600" />
            <span>{language === "bn" ? "EN" : "বাং"}</span>
          </button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="p-2 text-primary" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle className="text-base font-bold text-primary mb-6">{t("header_menu")}</SheetTitle>
              
              <div className="flex flex-col gap-1 mb-6">
                {userRole === "ADMIN" && (
                  <SheetClose asChild>
                    <Link href="/admin" className="py-2.5 text-sm font-bold text-purple-700 border-b border-neutral-200 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-purple-600" />
                      <span>Admin Control Center</span>
                    </Link>
                  </SheetClose>
                )}
                {status === "authenticated" && (
                  <SheetClose asChild>
                    <Link href="/dashboard" className="py-2.5 text-sm font-bold text-sky-700 border-b border-neutral-200 flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-sky-600" />
                      <span>{language === "bn" ? "আমার ড্যাশবোর্ড" : "My Dashboard"}</span>
                    </Link>
                  </SheetClose>
                )}
                <SheetClose asChild>
                  <Link href="/listings" className="py-2.5 text-sm text-neutral-700 border-b border-neutral-200">
                    {t("header_find_parts")}
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/post-ad" className="py-2.5 text-sm text-neutral-700 border-b border-neutral-200">
                    {t("header_post_ad")}
                  </Link>
                </SheetClose>
              </div>

              <div className="flex flex-col gap-3">
                <SheetClose asChild>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/listings">{t("header_find_parts")}</Link>
                  </Button>
                </SheetClose>
                
                {status === "authenticated" ? (
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="block py-2 text-center text-sm font-semibold text-red-600 hover:underline"
                  >
                    লগআউট ({session.user?.name})
                  </button>
                ) : (
                  <SheetClose asChild>
                    <Link href="/login" className="block py-2 text-center text-sm font-semibold text-primary-800">
                      {t("header_login")}
                    </Link>
                  </SheetClose>
                )}

                <SheetClose asChild>
                  <Button asChild className="w-full" variant="accent">
                    <Link href="/post-ad">{t("header_post_ad")}</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}
