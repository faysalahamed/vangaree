"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ShieldAlert,
  ShieldCheck,
  Package,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  ExternalLink,
  Search,
  RefreshCw,
  ArrowLeft,
  AlertTriangle,
  Lock,
  ChevronDown,
  Filter,
  Megaphone,
  Plus,
  LayoutDashboard,
  Store,
  BarChart3
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import AdminAdsTab from "@/components/admin/AdminAdsTab";
import AdminAnalyticsTab from "@/components/admin/AdminAnalyticsTab";
import DashboardShell, { SidebarMenuItem } from "@/components/layout/DashboardShell";

interface ListingItem {
  id: string;
  phoneBrand: string;
  phoneModel: string;
  partType: string;
  condition: string;
  price: number | null;
  status: "ACTIVE" | "SOLD" | "CLOSED" | "DRAFT";
  location: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    phone: string;
  };
  photos: { url: string }[];
}

interface UserItem {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: "USER" | "ADMIN" | "TECHNICIAN";
  location: string | null;
  createdAt: string;
  _count: {
    listings: number;
  };
}

interface StatsData {
  totalAds: number;
  activeAds: number;
  soldAds: number;
  closedAds: number;
  totalUsers: number;
  adminUsers: number;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<"listings" | "users" | "ads" | "analytics">("listings");
  const [stats, setStats] = useState<StatsData | null>(null);
  
  // Listings state
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingSearch, setListingSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Users state
  const [users, setUsers] = useState<UserItem[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userActionLoadingId, setUserActionLoadingId] = useState<string | null>(null);

  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const userRole = (session?.user as { role?: string } | undefined)?.role;

  // Show temporary toast notification
  function showNotification(message: string, type: "success" | "error" = "success") {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  }

  // Fetch Stats
  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  }

  // Fetch Listings
  async function fetchListings() {
    setListingsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (listingSearch) params.set("q", listingSearch);

      const res = await fetch(`/api/admin/listings?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (err) {
      console.error("Failed to load listings", err);
    } finally {
      setListingsLoading(false);
    }
  }

  // Fetch Users
  async function fetchUsers() {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams();
      if (userSearch) params.set("q", userSearch);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setUsersLoading(false);
    }
  }

  useEffect(() => {
    if (status === "authenticated" && userRole === "ADMIN") {
      fetchStats();
      fetchListings();
    }
  }, [status, userRole, statusFilter]);

  useEffect(() => {
    if (activeTab === "users" && users.length === 0 && userRole === "ADMIN") {
      fetchUsers();
    }
  }, [activeTab]);

  // Update listing status
  async function handleStatusChange(id: string, newStatus: string) {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setListings((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus as any } : item))
        );
        fetchStats();
        showNotification(language === "bn" ? "বিজ্ঞাপনের স্ট্যাটাস আপডেট হয়েছে।" : "Listing status updated.");
      } else {
        showNotification(language === "bn" ? "স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে।" : "Failed to update status.", "error");
      }
    } catch (err) {
      showNotification("Error updating listing", "error");
    } finally {
      setActionLoadingId(null);
    }
  }

  // Delete listing
  async function handleDeleteListing(id: string, title: string) {
    const confirmMsg = language === "bn"
      ? `আপনি কি নিশ্চিতভাবে "${title}" বিজ্ঞাপনটি ডিলিট করতে চান?`
      : `Are you sure you want to permanently delete "${title}"?`;

    if (!window.confirm(confirmMsg)) return;

    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setListings((prev) => prev.filter((item) => item.id !== id));
        fetchStats();
        showNotification(language === "bn" ? "বিজ্ঞাপন সফলভাবে মুছে ফেলা হয়েছে।" : "Listing permanently deleted.");
      } else {
        showNotification(language === "bn" ? "বিজ্ঞাপন মোছা সম্ভব হয়নি।" : "Failed to delete listing.", "error");
      }
    } catch (err) {
      showNotification("Error deleting listing", "error");
    } finally {
      setActionLoadingId(null);
    }
  }

  // Update user role
  async function handleRoleChange(userId: string, newRole: string) {
    setUserActionLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u))
        );
        fetchStats();
        showNotification(language === "bn" ? "ইউজার রোল সফলভাবে আপডেট হয়েছে।" : "User role updated successfully.");
      } else {
        showNotification(language === "bn" ? "রোল আপডেট ব্যর্থ হয়েছে।" : "Failed to update user role.", "error");
      }
    } catch (err) {
      showNotification("Error updating user role", "error");
    } finally {
      setUserActionLoadingId(null);
    }
  }

  // --------------------------------------------------------------------------
  // ACCESS RESTRICTED SCREENS
  // --------------------------------------------------------------------------
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#f0f3f8] flex items-center justify-center p-4">
        <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-md border border-slate-200">
          <RefreshCw className="h-5 w-5 text-sky-600 animate-spin" />
          <span className="text-sm font-bold text-slate-700">
            {language === "bn" ? "অ্যাডমিন ভেরিফিকেশন হচ্ছে..." : "Verifying admin access..."}
          </span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#f0f3f8] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-sm">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-black text-slate-900 mb-2">
            {language === "bn" ? "অ্যাডমিন লগইন প্রয়োজন" : "Admin Login Required"}
          </h1>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            {language === "bn"
              ? "অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করতে আপনার অনুমোদিত অ্যাডমিন অ্যাকাউন্টে লগইন করুন।"
              : "Please sign in with your authorized admin account to access the control panel."}
          </p>
          <Link
            href="/login?callbackUrl=/admin"
            className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm transition-all shadow-md shadow-sky-600/20 inline-block"
          >
            {language === "bn" ? "লগইন পেজে যান" : "Proceed to Login"}
          </Link>
        </div>
      </div>
    );
  }

  if (userRole !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#f0f3f8] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200 shadow-sm">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-black text-slate-900 mb-2">
            {language === "bn" ? "অনুমতি নেই (Access Restricted)" : "Access Denied"}
          </h1>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            {language === "bn"
              ? "আপনার অ্যাকাউন্টে অ্যাডমিন ক্ষমতা নেই। অ্যাডমিন অ্যাকাউন্টে লগইন করুন (যেমন: 01700000001 বা 01534747865)।"
              : "Your account does not have admin privileges. Please sign in with an admin number."}
          </p>
          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all text-center"
            >
              {language === "bn" ? "হোম পেজে যান" : "Back to Home"}
            </Link>
            <Link
              href="/login?callbackUrl=/admin"
              className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all text-center"
            >
              {language === "bn" ? "অ্যাকাউন্ট পরিবর্তন" : "Switch Account"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const menuItems: SidebarMenuItem[] = [
    {
      id: "listings",
      label: language === "bn" ? "বিজ্ঞাপন নিয়ন্ত্রণ" : "Manage Listings",
      icon: <Package className="h-4 w-4" />,
      badge: listings.length
    },
    {
      id: "ads",
      label: language === "bn" ? "ব্যানার ও স্পন্সর" : "Promotions & Ads",
      icon: <Megaphone className="h-4 w-4" />
    },
    {
      id: "users",
      label: language === "bn" ? "ইউজার ব্যবস্থাপনা" : "Manage Users",
      icon: <Users className="h-4 w-4" />,
      badge: users.length > 0 ? users.length : undefined
    },
    {
      id: "analytics",
      label: language === "bn" ? "ভিজিটর ও সার্চ তথ্য" : "Visitor & Search Logs",
      icon: <BarChart3 className="h-4 w-4" />
    },
    {
      id: "post_ad",
      label: language === "bn" ? "নতুন বিজ্ঞাপন দিন" : "Post New Ad",
      icon: <Plus className="h-4 w-4" />,
      href: "/post-ad"
    },
    {
      id: "user_dash",
      label: language === "bn" ? "ইউজার ড্যাশবোর্ড" : "User Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      href: "/dashboard"
    },
    {
      id: "website",
      label: language === "bn" ? "ওয়েবসাইট দেখুন" : "Back to Website",
      icon: <Store className="h-4 w-4" />,
      href: "/"
    }
  ];

  // --------------------------------------------------------------------------
  // MAIN ADMIN DASHBOARD INTERFACE
  // --------------------------------------------------------------------------
  return (
    <DashboardShell
      title={language === "bn" ? "অ্যাডমিন কন্ট্রোল সেন্টার" : "Admin Control Center"}
      subtitle={
        language === "bn"
          ? `স্বাগতম, ${session?.user?.name || "Admin"}!`
          : `Welcome back, ${session?.user?.name || "Admin"}!`
      }
      roleBadge="ADMIN PANEL"
      menuItems={menuItems}
      activeMenuId={activeTab}
      onSelectMenu={(id) => setActiveTab(id as any)}
      rightHeaderExtra={
        <button
          onClick={() => {
            fetchStats();
            if (activeTab === "listings") fetchListings();
            if (activeTab === "users") fetchUsers();
            showNotification(language === "bn" ? "তথ্য রিফ্রেশ করা হয়েছে" : "Data refreshed");
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold transition-all shadow-sm shadow-sky-600/20 active:scale-95"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>{language === "bn" ? "রিফ্রেশ" : "Refresh"}</span>
        </button>
      }
    >
      {/* Floating Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold text-white transition-all ${
            notification.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        
        {/* Total Ads Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#cbe2f8] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === "bn" ? "মোট বিজ্ঞাপন" : "Total Ads"}
            </span>
            <div className="p-2 rounded-xl bg-[#eaf4fe] text-[#0284c7]">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats?.totalAds ?? "..."}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
            <span className="text-emerald-600 font-bold">{stats?.activeAds ?? 0} {language === "bn" ? "সচল" : "Active"}</span>
            <span>•</span>
            <span className="text-[#0284c7] font-bold">{stats?.soldAds ?? 0} {language === "bn" ? "বিক্রিত" : "Sold"}</span>
          </div>
        </div>

        {/* Active Ads Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#cbe2f8] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === "bn" ? "লাইভ বিজ্ঞাপন" : "Live Ads"}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {stats?.activeAds ?? "..."}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {language === "bn" ? "বর্তমানে সার্চে দৃশ্যমান" : "Visible in marketplace search"}
          </p>
        </div>

        {/* Total Users Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#cbe2f8] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === "bn" ? "মোট ইউজার" : "Total Users"}
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats?.totalUsers ?? "..."}
          </div>
          <p className="text-[11px] text-indigo-600 font-semibold mt-2">
            {stats?.adminUsers ?? 1} {language === "bn" ? "অ্যাডমিন অ্যাকাউন্ট" : "Admin Accounts"}
          </p>
        </div>

        {/* Closed / Archived Ads Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#cbe2f8] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === "bn" ? "বন্ধ / ক্লোজড" : "Closed / Inactive"}
            </span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <XCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-600">
            {stats?.closedAds ?? "..."}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {language === "bn" ? "ব্যবহারকারী বা অ্যাডমিন কর্তৃক স্থগিত" : "Hidden or paused ads"}
          </p>
        </div>

      </div>

      {/* =====================================================================
          TAB 1: LISTINGS / ADS MANAGEMENT
           ===================================================================== */}
        {activeTab === "listings" && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            
            {/* Filter and Search Toolbar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              
              {/* Search Field */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={listingSearch}
                  onChange={(e) => setListingSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") fetchListings();
                  }}
                  placeholder={language === "bn" ? "মডেল, পার্টস, সেলার নাম বা ফোন খুঁজুন..." : "Search model, brand, seller phone..."}
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="h-3 w-3" />
                  {language === "bn" ? "স্ট্যাটাস:" : "Status:"}
                </span>
                {["ALL", "ACTIVE", "SOLD", "CLOSED"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      statusFilter === st
                        ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:border-sky-400 hover:text-sky-600"
                    }`}
                  >
                    {st === "ALL" && (language === "bn" ? "সবগুলো" : "All")}
                    {st === "ACTIVE" && (language === "bn" ? "সচল" : "Active")}
                    {st === "SOLD" && (language === "bn" ? "বিক্রিত" : "Sold")}
                    {st === "CLOSED" && (language === "bn" ? "বন্ধ" : "Closed")}
                  </button>
                ))}
              </div>

            </div>

            {/* Listings Table / Content */}
            {listingsLoading ? (
              <div className="py-16 text-center">
                <RefreshCw className="h-6 w-6 text-sky-600 animate-spin mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-500">
                  {language === "bn" ? "বিজ্ঞাপন লোড হচ্ছে..." : "Loading listings..."}
                </p>
              </div>
            ) : listings.length === 0 ? (
              <div className="py-16 text-center">
                <Package className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-700">
                  {language === "bn" ? "কোনো বিজ্ঞাপন পাওয়া যায়নি" : "No listings found"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {language === "bn" ? "ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।" : "Try adjusting your search or filters."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="py-3 px-4">যন্ত্রাংশ ও মডেল</th>
                      <th className="py-3 px-4">সেলার (ব্যবহারকারী)</th>
                      <th className="py-3 px-4">মূল্য</th>
                      <th className="py-3 px-4">তারিখ</th>
                      <th className="py-3 px-4">স্ট্যাটাস</th>
                      <th className="py-3 px-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {listings.map((item) => {
                      const isActing = actionLoadingId === item.id;
                      const photoUrl = item.photos[0]?.url || "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=200&auto=format&fit=crop";

                      return (
                        <tr key={item.id} className="hover:bg-sky-50/30 transition-colors">
                          
                          {/* Hardware & Model */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                <Image
                                  src={photoUrl}
                                  alt={item.phoneModel}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <span className="font-extrabold text-slate-900 text-sm block">
                                  {item.phoneBrand} {item.phoneModel}
                                </span>
                                <span className="text-sky-700 font-semibold text-[11px] block">
                                  {item.partType} • <span className="text-slate-400 font-normal">{item.condition.replace("_", " ")}</span>
                                </span>
                                <span className="text-[10px] text-slate-400 block">
                                  📍 {item.location}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Seller info */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-800">{item.user?.name || "Anonymous"}</div>
                            <div className="text-[11px] font-mono text-slate-500">{item.user?.phone}</div>
                          </td>

                          {/* Price */}
                          <td className="py-3.5 px-4">
                            {item.price != null ? (
                              <span className="font-black text-slate-900">৳ {item.price.toLocaleString()}</span>
                            ) : (
                              <span className="text-[11px] font-semibold text-slate-400">বিনিময় / আলোচনা</span>
                            )}
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                            <div className="flex items-center gap-1 text-[11px]">
                              <Clock className="h-3 w-3 text-slate-400" />
                              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                          </td>

                          {/* Status Dropdown */}
                          <td className="py-3.5 px-4">
                            <select
                              value={item.status}
                              disabled={isActing}
                              onChange={(e) => handleStatusChange(item.id, e.target.value)}
                              className={`h-8 px-2 rounded-lg text-xs font-bold outline-none cursor-pointer border transition-all ${
                                item.status === "ACTIVE"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                  : item.status === "SOLD"
                                  ? "bg-sky-50 text-sky-700 border-sky-300"
                                  : "bg-slate-100 text-slate-600 border-slate-300"
                              }`}
                            >
                              <option value="ACTIVE">🟢 ACTIVE (সচল)</option>
                              <option value="SOLD">🔵 SOLD (বিক্রিত)</option>
                              <option value="CLOSED">⚪ CLOSED (বন্ধ)</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View live page */}
                              <Link
                                href={`/listings/${item.id}`}
                                target="_blank"
                                title={language === "bn" ? "লাইভ বিজ্ঞাপন দেখুন" : "View Live Ad"}
                                className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-600 flex items-center justify-center transition-colors"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>

                              {/* Delete Ad */}
                              <button
                                type="button"
                                disabled={isActing}
                                onClick={() => handleDeleteListing(item.id, `${item.phoneBrand} ${item.phoneModel}`)}
                                title={language === "bn" ? "বিজ্ঞাপন স্থায়ীভাবে মুছুন" : "Permanently Delete Ad"}
                                className="h-8 w-8 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white flex items-center justify-center transition-colors disabled:opacity-40"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* =====================================================================
            TAB 2: USERS MANAGEMENT
           ===================================================================== */}
        {activeTab === "users" && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            
            {/* Search Toolbar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") fetchUsers();
                  }}
                  placeholder={language === "bn" ? "নাম, মোবাইল নম্বর বা লোকেশন খুঁজুন..." : "Search user by name, phone or location..."}
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all"
                />
              </div>
              <button
                type="button"
                onClick={fetchUsers}
                className="h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
              >
                {language === "bn" ? "খুঁজুন" : "Search"}
              </button>
            </div>

            {/* Users Table */}
            {usersLoading ? (
              <div className="py-16 text-center">
                <RefreshCw className="h-6 w-6 text-sky-600 animate-spin mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-500">
                  {language === "bn" ? "ইউজার তালিকা লোড হচ্ছে..." : "Loading users..."}
                </p>
              </div>
            ) : users.length === 0 ? (
              <div className="py-16 text-center">
                <Users className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-700">
                  {language === "bn" ? "কোনো ইউজার পাওয়া যায়নি" : "No users found"}
                </h3>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="py-3 px-4">ইউজার ও ফোন নম্বর</th>
                      <th className="py-3 px-4">লোকেশন</th>
                      <th className="py-3 px-4">বিজ্ঞাপন সংখ্যা</th>
                      <th className="py-3 px-4">রেজিস্ট্রেশন তারিখ</th>
                      <th className="py-3 px-4">রোল (অ্যাক্সেস লেভেল)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => {
                      const isUpdating = userActionLoadingId === u.id;
                      return (
                        <tr key={u.id} className="hover:bg-sky-50/30 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-extrabold text-slate-900 text-sm">{u.name}</div>
                            <div className="text-xs font-mono text-slate-500">{u.phone}</div>
                            {u.email && <div className="text-[10px] text-slate-400">{u.email}</div>}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">
                            {u.location || "—"}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                              {u._count.listings} {language === "bn" ? "বিজ্ঞাপন" : "Ads"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={u.role}
                              disabled={isUpdating}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              className={`h-8 px-2.5 rounded-lg text-xs font-bold outline-none cursor-pointer border transition-all ${
                                u.role === "ADMIN"
                                  ? "bg-purple-50 text-purple-700 border-purple-300 font-black"
                                  : u.role === "TECHNICIAN"
                                  ? "bg-amber-50 text-amber-700 border-amber-300"
                                  : "bg-white text-slate-700 border-slate-300"
                              }`}
                            >
                              <option value="USER">👤 USER (সাধারণ)</option>
                              <option value="ADMIN">🛡️ ADMIN (অ্যাডমিন)</option>
                              <option value="TECHNICIAN">🔧 TECHNICIAN (টেকনিশিয়ান)</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* =====================================================================
            TAB 3: ADVERTISEMENTS & SPONSORS MANAGEMENT
           ===================================================================== */}
        {activeTab === "ads" && <AdminAdsTab />}

        {/* =====================================================================
            TAB 4: VISITOR & SEARCH ANALYTICS
           ===================================================================== */}
        {activeTab === "analytics" && <AdminAnalyticsTab />}
    </DashboardShell>
  );
}
