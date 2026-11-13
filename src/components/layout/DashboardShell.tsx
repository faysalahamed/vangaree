"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  LogOut,
  Menu,
  X,
  Globe,
  User as UserIcon,
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import NotificationBell from "@/components/NotificationBell";

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string | number;
}

interface DashboardShellProps {
  title: string;
  subtitle?: string;
  roleBadge?: string;
  menuItems: SidebarMenuItem[];
  activeMenuId: string;
  onSelectMenu: (id: string) => void;
  rightHeaderExtra?: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardShell({
  title,
  subtitle,
  roleBadge,
  menuItems,
  activeMenuId,
  onSelectMenu,
  rightHeaderExtra,
  children
}: DashboardShellProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { language, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const userName = session?.user?.name || "User";
  const userRole = (session?.user as { role?: string } | undefined)?.role;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/listings");
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between bg-white">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-[#dbeafe] flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-sky-200 shadow-xs shrink-0">
              <Image
                src="/logo.jpg"
                alt="Vangare Logo"
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center leading-none">
                <span className="text-slate-900 font-black tracking-tight text-lg">vangare</span>
                <span className="text-[#0284c7] font-black text-lg">.site</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                {language === "bn" ? "পার্টস এক্সচেঞ্জ সিস্টেম" : "Parts Exchange System"}
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3.5 space-y-1">
          {menuItems.map((item) => {
            const isActive = activeMenuId === item.id;

            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-[#eaf4fe] hover:text-[#0284c7] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 group-hover:text-[#0284c7] transition-colors">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-300 group-hover:text-[#0284c7]" />
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectMenu(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#1d9bf0] to-[#0284c7] text-white shadow-sm shadow-sky-500/25"
                    : "text-slate-600 hover:bg-[#eaf4fe] hover:text-[#0284c7]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-white" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-[#eaf4fe] text-[#0284c7]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Logout Section */}
      <div className="p-3.5 border-t border-[#dbeafe]">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span>{language === "bn" ? "লগআউট" : "Logout"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#ddf1fd] flex flex-col lg:flex-row">
      
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-[#cbe2f8] bg-white sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] bg-white h-full shadow-2xl z-10">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Right Side: Top Bar + Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top White Header Bar */}
        <header className="h-16 bg-white border-b border-[#cbe2f8] px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30">
          
          {/* Left: Hamburger + Search Bar */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-[#cbe2f8] text-slate-600 hover:bg-[#eaf4fe] hover:text-[#0284c7]"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === "bn" ? "যেকোনো পার্টস খুঁজুন..." : "Search anything..."}
                className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#f1f6fb] border border-[#dbeafe] text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
              />
            </form>
          </div>

          {/* Right: Language, Bell, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#f1f6fb] hover:bg-[#eaf4fe] border border-[#dbeafe] text-xs font-bold text-slate-700 hover:text-[#0284c7] transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-[#0284c7]" />
              <span className="hidden sm:inline">{language === "bn" ? "EN" : "বাংলা"}</span>
            </button>

            <NotificationBell />

            <div className="flex items-center gap-2 pl-2 border-l border-[#dbeafe]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1d9bf0] to-[#0284c7] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {userRole === "ADMIN" ? (
                  <ShieldCheck className="h-4 w-4" />
                ) : (
                  <UserIcon className="h-4 w-4" />
                )}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <span className="text-xs font-extrabold text-slate-900 block max-w-[120px] truncate">
                  {userName}
                </span>
                <span className="text-[10px] font-bold text-[#0284c7]">
                  {userRole === "ADMIN" ? "Admin" : language === "bn" ? "সদস্য" : "Member"}
                </span>
              </div>
            </div>
          </div>

        </header>

        {/* Main Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          
          {/* Page Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              {roleBadge && (
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white border border-[#cbe2f8] text-[#0284c7] text-[10px] font-extrabold uppercase tracking-wider mb-1">
                  {roleBadge}
                </span>
              )}
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
              )}
            </div>

            {rightHeaderExtra && (
              <div className="flex items-center gap-2">{rightHeaderExtra}</div>
            )}
          </div>

          {children}
        </main>

      </div>

    </div>
  );
}
