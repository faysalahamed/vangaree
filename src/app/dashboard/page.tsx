"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  User,
  Package,
  MapPin,
  Lock,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
  Plus,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Edit3,
  Calendar,
  Sparkles,
  LayoutDashboard,
  Store,
  Bell,
  MessageSquareQuote,
  CheckCheck
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
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
  photos: { url: string }[];
}

interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  location: string | null;
  role: string;
  createdAt: string;
  _count?: {
    listings: number;
  };
}

export default function UserDashboardPage() {
  const { data: session, status } = useSession();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<"overview" | "listings" | "notifications" | "profile" | "password">("overview");

  // Profile data
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Edit profile form
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    location: ""
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // Change password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordSaving, setPasswordSaving] = useState(false);

  // User Listings
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // User Notifications & Inquiries
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // Toast banner
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function showNotification(message: string, type: "success" | "error" = "success") {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  }

  // Fetch user notifications
  async function fetchUserNotifications() {
    setNotificationsLoading(true);
    try {
      const res = await fetch("/api/user/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotificationsList(data.notifications || []);
        setUnreadNotificationsCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setNotificationsLoading(false);
    }
  }

  // Mark all notifications as read
  async function handleMarkAllNotificationsRead() {
    try {
      await fetch("/api/user/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      setUnreadNotificationsCount(0);
      setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
      showNotification(language === "bn" ? "সব নোটিফিকেশন পঠিত হিসেবে চিহ্নিত করা হয়েছে।" : "All marked as read.");
    } catch {
      showNotification("Error", "error");
    }
  }

  // Fetch user profile
  async function fetchProfile() {
    setProfileLoading(true);
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setProfileForm({
          name: data.name || "",
          email: data.email || "",
          location: data.location || ""
        });
      }
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setProfileLoading(false);
    }
  }

  // Fetch user's listings
  async function fetchListings() {
    setListingsLoading(true);
    try {
      const res = await fetch("/api/user/listings");
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

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
      fetchListings();
      fetchUserNotifications();
    }
  }, [status]);

  // Handle profile update
  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm)
      });

      const data = await res.json();
      if (res.ok) {
        setProfile((prev) => prev ? { ...prev, ...data } : null);
        showNotification(language === "bn" ? "প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে।" : "Profile updated successfully.");
      } else {
        showNotification(data.error || "Failed to update profile", "error");
      }
    } catch (err) {
      showNotification("Error saving profile", "error");
    } finally {
      setProfileSaving(false);
    }
  }

  // Handle password change
  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification(language === "bn" ? "নতুন পাসওয়ার্ড ও নিশ্চিতকরণ মিলছে না।" : "New passwords do not match.", "error");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showNotification(language === "bn" ? "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।" : "Password must be at least 6 characters.", "error");
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        showNotification(language === "bn" ? "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।" : "Password changed successfully.");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showNotification(data.error || (language === "bn" ? "বর্তমান পাসওয়ার্ড সঠিক নয়।" : "Failed to change password."), "error");
      }
    } catch (err) {
      showNotification("Error updating password", "error");
    } finally {
      setPasswordSaving(false);
    }
  }

  // Handle listing status change (e.g. SOLD, ACTIVE, CLOSED)
  async function handleStatusChange(id: string, newStatus: string) {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/user/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setListings((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus as any } : item))
        );
        showNotification(language === "bn" ? "বিজ্ঞাপনের স্ট্যাটাস আপডেট হয়েছে।" : "Status updated.");
      } else {
        showNotification("Failed to update status", "error");
      }
    } catch (err) {
      showNotification("Error updating status", "error");
    } finally {
      setActionLoadingId(null);
    }
  }

  // Handle listing delete
  async function handleDeleteListing(id: string, title: string) {
    const confirmMsg = language === "bn"
      ? `আপনি কি নিশ্চিতভাবে "${title}" বিজ্ঞাপনটি ডিলিট করতে চান?`
      : `Are you sure you want to delete "${title}"?`;

    if (!window.confirm(confirmMsg)) return;

    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/user/listings/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setListings((prev) => prev.filter((item) => item.id !== id));
        showNotification(language === "bn" ? "বিজ্ঞাপন সফলভাবে মুছে ফেলা হয়েছে।" : "Listing deleted.");
      } else {
        showNotification("Failed to delete listing", "error");
      }
    } catch (err) {
      showNotification("Error deleting listing", "error");
    } finally {
      setActionLoadingId(null);
    }
  }

  // --------------------------------------------------------------------------
  // AUTH CHECKS
  // --------------------------------------------------------------------------
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#f0f3f8] flex items-center justify-center p-4">
        <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-md border border-slate-200">
          <RefreshCw className="h-5 w-5 text-sky-600 animate-spin" />
          <span className="text-sm font-bold text-slate-700">
            {language === "bn" ? "লোড হচ্ছে..." : "Loading dashboard..."}
          </span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#f0f3f8] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4 border border-sky-200 shadow-sm">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-black text-slate-900 mb-2">
            {language === "bn" ? "লগইন প্রয়োজন" : "Login Required"}
          </h1>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            {language === "bn"
              ? "আপনার ড্যাশবোর্ড ও বিজ্ঞাপনসমূহ দেখতে অ্যাকাউন্টে লগইন করুন।"
              : "Please sign in to view your dashboard, manage listings, and update profile."}
          </p>
          <Link
            href="/login?callbackUrl=/dashboard"
            className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm transition-all shadow-md shadow-sky-600/20 inline-block"
          >
            {language === "bn" ? "লগইন পেজে যান" : "Go to Login"}
          </Link>
        </div>
      </div>
    );
  }

  const activeAdsCount = listings.filter((l) => l.status === "ACTIVE").length;
  const soldAdsCount = listings.filter((l) => l.status === "SOLD").length;

  const menuItems: SidebarMenuItem[] = [
    {
      id: "overview",
      label: language === "bn" ? "ড্যাশবোর্ড" : "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />
    },
    {
      id: "listings",
      label: language === "bn" ? "আমার বিজ্ঞাপন" : "My Listings",
      icon: <Package className="h-4 w-4" />,
      badge: listings.length
    },
    {
      id: "notifications",
      label: language === "bn" ? "প্রশ্ন ও নোটিফিকেশন" : "Questions & Alerts",
      icon: <Bell className="h-4 w-4" />,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined
    },
    {
      id: "post_ad",
      label: language === "bn" ? "নতুন বিজ্ঞাপন দিন" : "Post New Ad",
      icon: <Plus className="h-4 w-4" />,
      href: "/post-ad"
    },
    {
      id: "profile",
      label: language === "bn" ? "প্রোফাইল ও ঠিকানা" : "Profile & Address",
      icon: <Edit3 className="h-4 w-4" />
    },
    {
      id: "password",
      label: language === "bn" ? "পাসওয়ার্ড পরিবর্তন" : "Security & Password",
      icon: <Lock className="h-4 w-4" />
    },
    ...(profile?.role === "ADMIN"
      ? [
          {
            id: "admin_panel",
            label: language === "bn" ? "অ্যাডমিন প্যানেল" : "Admin Panel",
            icon: <ShieldCheck className="h-4 w-4" />,
            href: "/admin"
          }
        ]
      : []),
    {
      id: "market",
      label: language === "bn" ? "মার্কেট দেখুন" : "Browse Market",
      icon: <Store className="h-4 w-4" />,
      href: "/"
    }
  ];

  return (
    <DashboardShell
      title={language === "bn" ? "ইউজার ড্যাশবোর্ড" : "Dashboard"}
      subtitle={
        language === "bn"
          ? `স্বাগতম, ${profile?.name || session?.user?.name || "ব্যবহারকারী"}!`
          : `Welcome back, ${profile?.name || session?.user?.name || "User"}!`
      }
      roleBadge={profile?.role === "ADMIN" ? "ADMIN USER" : language === "bn" ? "সদস্য প্যানেল" : "USER PANEL"}
      menuItems={menuItems}
      activeMenuId={activeTab}
      onSelectMenu={(id) => setActiveTab(id as any)}
      rightHeaderExtra={
        <Link
          href="/post-ad"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold transition-all shadow-sm shadow-sky-500/25 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>{language === "bn" ? "নতুন বিজ্ঞাপন" : "Post Ad"}</span>
        </Link>
      }
    >
      {/* Floating Notification Toast */}
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

      {/* =====================================================================
          TAB 0: OVERVIEW (ড্যাশবোর্ড ওভারভিউ)
         ===================================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          
          {/* Top 4 Stat Cards matching reference */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-[#cbe2f8] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#eaf4fe] text-[#0284c7] flex items-center justify-center mb-3">
                <Package className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-slate-500 block">
                {language === "bn" ? "মোট বিজ্ঞাপন" : "Total Ads"}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 block">
                {listings.length}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#cbe2f8] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-slate-500 block">
                {language === "bn" ? "সচল বিজ্ঞাপন" : "Active Ads"}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 mt-0.5 block">
                {activeAdsCount}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#cbe2f8] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284c7] flex items-center justify-center mb-3">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-slate-500 block">
                {language === "bn" ? "বিক্রিত / এক্সচেঞ্জড" : "Sold / Swapped"}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-[#0284c7] mt-0.5 block">
                {soldAdsCount}
              </span>
            </div>

            <div
              onClick={() => setActiveTab("notifications")}
              className="bg-white rounded-2xl p-5 border border-[#cbe2f8] shadow-xs cursor-pointer hover:border-sky-400 hover:shadow-xs transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Bell className="h-5 w-5" />
                </div>
                {unreadNotificationsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black animate-pulse">
                    {unreadNotificationsCount} {language === "bn" ? "নতুন" : "New"}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-slate-500 block">
                {language === "bn" ? "পণ্যের প্রশ্ন ও নোটিফিকেশন" : "Inquiries & Alerts"}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 block">
                {notificationsList.length}
              </span>
            </div>
          </div>

          {/* Two Column Overview Grid: Recent Listings & Quick Account Links */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recent Ads Card */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#cbe2f8] shadow-xs overflow-hidden">
              <div className="bg-[#eaf4fe] px-5 py-3.5 border-b border-[#cbe2f8] flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#0369a1]">
                  {language === "bn" ? "সাম্প্রতিক বিজ্ঞাপনসমূহ" : "Recent Listings"}
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab("listings")}
                  className="text-xs font-bold text-[#0284c7] hover:underline flex items-center gap-1"
                >
                  <span>{language === "bn" ? "সব দেখুন" : "View All"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="p-5">
                {listings.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">
                    {language === "bn" ? "এখনও কোনো বিজ্ঞাপন পোস্ট করা হয়নি।" : "No ads posted yet."}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {listings.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-[#dbeafe] hover:border-sky-300 bg-[#f8fbff] transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-[#eaf4fe] text-[#0284c7] flex items-center justify-center shrink-0">
                            <Package className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-extrabold text-slate-900 truncate">
                              {item.phoneBrand} {item.phoneModel} • {item.partType}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {item.location} • {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          item.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-sky-50 text-[#0284c7] border border-sky-200"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl border border-[#cbe2f8] shadow-xs overflow-hidden">
              <div className="bg-[#eaf4fe] px-5 py-3.5 border-b border-[#cbe2f8]">
                <h2 className="text-sm font-bold text-[#0369a1]">
                  {language === "bn" ? "দ্রুত মেনু (Quick Actions)" : "Quick Actions"}
                </h2>
              </div>
              <div className="p-4 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("notifications")}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-[#dbeafe] hover:border-sky-400 hover:bg-[#f0f7ff] transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {language === "bn" ? "ক্রেতাদের প্রশ্ন ও উত্তর" : "Buyer Inquiries & Replies"}
                      </span>
                      {unreadNotificationsCount > 0 && (
                        <span className="text-[10px] text-red-600 font-bold block">
                          {unreadNotificationsCount} {language === "bn" ? "টি নতুন প্রশ্ন" : "new inquiries"}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-[#dbeafe] hover:border-sky-400 hover:bg-[#f0f7ff] transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sky-50 text-[#0284c7]">
                      <Edit3 className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {language === "bn" ? "প্রোফাইল ও ঠিকানা পরিবর্তন" : "Update Profile & Address"}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("password")}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-[#dbeafe] hover:border-sky-400 hover:bg-[#f0f7ff] transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                      <Lock className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {language === "bn" ? "পাসওয়ার্ড পরিবর্তন" : "Change Password"}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </button>

                <Link
                  href="/post-ad"
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-[#dbeafe] hover:border-sky-400 hover:bg-[#f0f7ff] transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                      <Plus className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {language === "bn" ? "নতুন বিজ্ঞাপন পোস্ট" : "Post a New Ad"}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* =====================================================================
          TAB 1: MY LISTINGS (আমার বিজ্ঞাপনসমূহ)
         ===================================================================== */}
      {activeTab === "listings" && (
          <div className="bg-white rounded-2xl border border-[#cbe2f8] shadow-xs overflow-hidden">
            <div className="bg-[#eaf4fe] px-5 py-3.5 border-b border-[#cbe2f8] flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#0369a1]">
                  {language === "bn" ? "পোস্ট করা বিজ্ঞাপনসমূহ" : "Your Posted Listings"}
                </h2>
              </div>

              <button
                type="button"
                onClick={fetchListings}
                className="p-1.5 rounded-lg border border-sky-200 bg-white hover:bg-sky-50 text-[#0284c7] transition-colors"
                title="রিফ্রেশ"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 sm:p-7 bg-white">
              {listingsLoading ? (
                <div className="py-16 text-center">
                  <RefreshCw className="h-6 w-6 text-[#0284c7] animate-spin mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-500">
                    {language === "bn" ? "বিজ্ঞাপন লোড হচ্ছে..." : "Loading your listings..."}
                  </p>
                </div>
              ) : listings.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                  <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800">
                    {language === "bn" ? "আপনি এখনো কোনো বিজ্ঞাপন পোস্ট করেননি" : "No listings posted yet"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 mb-5">
                    {language === "bn"
                      ? "আপনার নষ্ট ডিভাইস বা খুচরা যন্ত্রাংশের বিজ্ঞাপন দিয়ে ক্রেতা বা এক্সচেঞ্জ পার্টনার খুঁজুন।"
                      : "List your donor device or spare parts to find matches."}
                  </p>
                  <Link
                    href="/post-ad"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold transition-all shadow-md shadow-sky-500/25"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{language === "bn" ? "প্রথম বিজ্ঞাপনটি দিন" : "Post Your First Ad"}</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {listings.map((item) => {
                    const isActing = actionLoadingId === item.id;
                    const photoUrl = item.photos[0]?.url || "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=300&auto=format&fit=crop";

                    return (
                      <div
                        key={item.id}
                        className="border border-[#cbe2f8] rounded-xl p-4 flex flex-col justify-between hover:border-sky-400 hover:shadow-xs transition-all duration-200 bg-white"
                      >
                        <div className="flex gap-3 mb-3">
                          {/* Image Thumbnail */}
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            <Image
                              src={photoUrl}
                              alt={item.phoneModel}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-extrabold text-slate-900 text-sm truncate">
                                {item.phoneBrand} {item.phoneModel}
                              </span>
                              
                              {/* Status Badge */}
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                                  item.status === "ACTIVE"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : item.status === "SOLD"
                                    ? "bg-sky-50 text-sky-700 border border-sky-200"
                                    : "bg-slate-100 text-slate-600 border border-slate-200"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>

                            <div className="text-xs text-[#0284c7] font-semibold mb-1">
                              {item.partType} • <span className="text-slate-400 font-normal">{item.condition.replace("_", " ")}</span>
                            </div>

                            <div className="flex items-center justify-between text-xs mt-2">
                              <span className="font-black text-slate-900">
                                {item.price != null ? `৳ ${item.price.toLocaleString()}` : "বিনিময় / আলোচনা"}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                📍 {item.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Bar */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                          {/* Status Toggle Buttons */}
                          <div className="flex items-center gap-1.5">
                            {item.status !== "SOLD" ? (
                              <button
                                type="button"
                                disabled={isActing}
                                onClick={() => handleStatusChange(item.id, "SOLD")}
                                className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0284c7] text-[11px] font-bold border border-sky-200 transition-colors disabled:opacity-40"
                              >
                                {language === "bn" ? "✓ Sold মার্ক করুন" : "✓ Mark Sold"}
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={isActing}
                                onClick={() => handleStatusChange(item.id, "ACTIVE")}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-200 transition-colors disabled:opacity-40"
                              >
                                {language === "bn" ? "সচল করুন (Active)" : "Reactivate"}
                              </button>
                            )}

                            {item.status === "ACTIVE" && (
                              <button
                                type="button"
                                disabled={isActing}
                                onClick={() => handleStatusChange(item.id, "CLOSED")}
                                className="px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200 transition-colors disabled:opacity-40"
                              >
                                {language === "bn" ? "স্থগিত" : "Pause"}
                              </button>
                            )}
                          </div>

                          {/* External View & Delete */}
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/listings/${item.id}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#0284c7] hover:bg-sky-50 transition-colors"
                              title="বিজ্ঞাপনটি দেখুন"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>

                            <button
                              type="button"
                              disabled={isActing}
                              onClick={() => handleDeleteListing(item.id, `${item.phoneBrand} ${item.phoneModel}`)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                              title="বিজ্ঞাপন মুছুন"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 1.5: NOTIFICATIONS & PRODUCT INQUIRIES (প্রশ্ন ও নোটিফিকেশন)
           ===================================================================== */}
        {activeTab === "notifications" && (
          <div className="bg-white rounded-2xl border border-[#cbe2f8] shadow-xs overflow-hidden">
            
            {/* Header Ribbon */}
            <div className="bg-[#eaf4fe] px-5 py-3.5 border-b border-[#cbe2f8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#0369a1] flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>{language === "bn" ? "বিজ্ঞাপনের প্রশ্ন ও নোটিফিকেশন" : "Product Inquiries & Notifications"}</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black">
                      {unreadNotificationsCount} {language === "bn" ? "নতুন" : "Unread"}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === "bn"
                    ? "ক্রেতারা আপনার বিজ্ঞাপনে কোনো প্রশ্ন করলে বা পণ্যের আপডেট আসলে এখানে দেখতে পাবেন।"
                    : "Buyer questions about your products and trade alerts appear here in real-time."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {unreadNotificationsCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllNotificationsRead}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#cbe2f8] text-xs font-bold text-[#0284c7] hover:bg-sky-50 shadow-2xs"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span>{language === "bn" ? "সব পঠিত করুন" : "Mark all read"}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={fetchUserNotifications}
                  className="p-2 rounded-xl bg-white border border-[#cbe2f8] text-slate-600 hover:text-[#0284c7] hover:bg-sky-50 transition-colors shadow-2xs"
                  title="Refresh"
                >
                  <RefreshCw className={`h-4 w-4 ${notificationsLoading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Notifications Body */}
            <div className="p-5 sm:p-6 bg-white">
              {notificationsLoading && notificationsList.length === 0 ? (
                <div className="py-16 text-center">
                  <RefreshCw className="h-6 w-6 text-[#0284c7] animate-spin mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-500">
                    {language === "bn" ? "নোটিফিকেশন লোড হচ্ছে..." : "Loading notifications..."}
                  </p>
                </div>
              ) : notificationsList.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#eaf4fe] text-[#0284c7] flex items-center justify-center mx-auto mb-3 border border-sky-200">
                    <MessageSquareQuote className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {language === "bn" ? "এখনও কোনো প্রশ্ন আসেনি" : "No questions or alerts yet"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    {language === "bn"
                      ? "কোনো ক্রেতা আপনার বিজ্ঞাপনে প্রশ্ন করলে সাথে সাথে এখানে নোটিফিকেশন চলে আসবে।"
                      : "When buyers ask questions on your listings, you will receive real-time notifications here."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notificationsList.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        !n.read
                          ? "bg-[#f0f7ff] border-sky-300 shadow-xs"
                          : "bg-white border-[#e2e8f0] hover:border-sky-300"
                      }`}
                    >
                      <div className="flex items-start gap-3.5 min-w-0 flex-1">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          !n.read
                            ? "bg-[#0284c7] text-white border-[#0284c7]"
                            : "bg-[#eaf4fe] text-[#0284c7] border-sky-200"
                        }`}>
                          <MessageSquareQuote className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                              {n.title}
                            </h4>
                            {!n.read && (
                              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black uppercase tracking-wider shrink-0">
                                {language === "bn" ? "নতুন" : "NEW"}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed mb-1.5">
                            {n.message}
                          </p>

                          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(n.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Link */}
                      <div className="shrink-0 w-full sm:w-auto text-right">
                        {n.link ? (
                          <Link
                            href={n.link}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                          >
                            <span>{language === "bn" ? "উত্তর দিন / দেখুন" : "View & Reply"}</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* =====================================================================
            TAB 2: PROFILE & ADDRESS (Header banner #eaf4fe + border #cbe2f8)
           ===================================================================== */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl border border-[#cbe2f8] shadow-xs overflow-hidden max-w-2xl">
            <div className="bg-[#eaf4fe] px-5 py-3.5 border-b border-[#cbe2f8]">
              <h2 className="text-sm sm:text-base font-bold text-[#0369a1]">
                {language === "bn" ? "ব্যবহারকারীর তথ্য ও ঠিকানা পরিবর্তন" : "Update Profile & Location"}
              </h2>
            </div>

            <div className="p-5 sm:p-7 bg-white">
              <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5">
                
                {/* Phone (Read Only) */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    {language === "bn" ? "মোবাইল নম্বর (পরিবর্তনযোগ্য নয়)" : "Phone Number (Permanent)"}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={profile?.phone || session?.user?.phone || ""}
                      disabled
                      className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5" htmlFor="profileName">
                    {language === "bn" ? "আপনার পূর্ণ নাম" : "Full Name"} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="profileName"
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="e.g. Rafiq Hossain"
                      className="w-full h-11 pl-9 pr-3 rounded-xl bg-white border border-[#cbd5e1] text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none hover:border-sky-400 hover:shadow-xs focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5" htmlFor="profileEmail">
                    {language === "bn" ? "ইমেইল এড্রেস (ঐচ্ছিক)" : "Email Address (Optional)"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="profileEmail"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      placeholder="e.g. rafiq@example.com"
                      className="w-full h-11 pl-9 pr-3 rounded-xl bg-white border border-[#cbd5e1] text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none hover:border-sky-400 hover:shadow-xs focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all"
                    />
                  </div>
                </div>

                {/* Location / Address */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5" htmlFor="profileLocation">
                    {language === "bn" ? "আপনার ঠিকানা / এলাকা (Location)" : "Default Area / Location"}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="profileLocation"
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      placeholder="e.g. Mirpur 10, Dhaka or Dhanmondi"
                      className="w-full h-11 pl-9 pr-3 rounded-xl bg-white border border-[#cbd5e1] text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none hover:border-sky-400 hover:shadow-xs focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all"
                    />
                  </div>
                  <span className="block text-[10px] text-slate-400 mt-1">
                    {language === "bn"
                      ? "সঠিক এলাকা দিলে আশেপাশের ক্রেতারা আপনার সাথে দ্রুত যোগাযোগ করতে পারবে"
                      : "Helps buyers identify local meetup distance"}
                  </span>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-6 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-sky-500/25 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{profileSaving ? (language === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving...") : (language === "bn" ? "তথ্য সংরক্ষণ করুন" : "Save Profile Changes")}</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: CHANGE PASSWORD (Header banner #eaf4fe + border #cbe2f8)
           ===================================================================== */}
        {activeTab === "password" && (
          <div className="bg-white rounded-2xl border border-[#cbe2f8] shadow-xs overflow-hidden max-w-2xl">
            <div className="bg-[#eaf4fe] px-5 py-3.5 border-b border-[#cbe2f8]">
              <h2 className="text-sm sm:text-base font-bold text-[#0369a1]">
                {language === "bn" ? "অ্যাকাউন্ট পাসওয়ার্ড পরিবর্তন করুন" : "Change Account Password"}
              </h2>
            </div>

            <div className="p-5 sm:p-7 bg-white">
              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                
                {/* Current Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5" htmlFor="currentPassword">
                    {language === "bn" ? "বর্তমান পাসওয়ার্ড" : "Current Password"} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="currentPassword"
                      type="password"
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full h-11 pl-9 pr-3 rounded-xl bg-white border border-[#cbd5e1] text-sm font-semibold text-slate-900 outline-none hover:border-sky-400 hover:shadow-xs focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5" htmlFor="newPassword">
                    {language === "bn" ? "নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)" : "New Password (At least 6 characters)"} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="newPassword"
                      type="password"
                      required
                      minLength={6}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full h-11 pl-9 pr-3 rounded-xl bg-white border border-[#cbd5e1] text-sm font-semibold text-slate-900 outline-none hover:border-sky-400 hover:shadow-xs focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5" htmlFor="confirmPassword">
                    {language === "bn" ? "নতুন পাসওয়ার্ড নিশ্চিত করুন" : "Confirm New Password"} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="confirmPassword"
                      type="password"
                      required
                      minLength={6}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full h-11 pl-9 pr-3 rounded-xl bg-white border border-[#cbd5e1] text-sm font-semibold text-slate-900 outline-none hover:border-sky-400 hover:shadow-xs focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all"
                    />
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="px-6 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-sky-500/25 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{passwordSaving ? (language === "bn" ? "পরিবর্তন হচ্ছে..." : "Updating...") : (language === "bn" ? "পাসওয়ার্ড পরিবর্তন করুন" : "Update Password")}</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}
    </DashboardShell>
  );
}
