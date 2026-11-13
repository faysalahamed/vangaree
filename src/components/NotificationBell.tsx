"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Clock, ExternalLink, X, MessageSquareQuote } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

// Gentle audio chime using Web Audio API (zero external assets needed)
function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    // Note 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
    gain1.gain.setValueAtTime(0.12, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // Note 2: 880 Hz (A5) slightly delayed
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.55);
  } catch {
    // Audio autoplay might be blocked prior to user interaction
  }
}

export default function NotificationBell() {
  const { data: session } = useSession();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [liveToast, setLiveToast] = useState<NotificationItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const previousUnreadRef = useRef<number | null>(null);

  // Request browser notification permission on first interaction
  const requestBrowserPermission = () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    }
  };

  async function fetchNotifications() {
    if (!session?.user) return;
    try {
      const res = await fetch("/api/user/notifications");
      if (res.ok) {
        const data = await res.json();
        const nextList: NotificationItem[] = data.notifications || [];
        const nextUnread: number = data.unreadCount || 0;

        // Check if new unread notification arrived
        if (
          previousUnreadRef.current !== null &&
          nextUnread > previousUnreadRef.current &&
          nextList.length > 0
        ) {
          const newest = nextList[0];
          setLiveToast(newest);
          playNotificationChime();

          // Native browser push notification if permitted
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            try {
              new Notification(newest.title, {
                body: newest.message,
                icon: "/logo.jpg"
              });
            } catch {
              // Ignore push errors
            }
          }

          // Auto-dismiss live toast after 7 seconds
          setTimeout(() => setLiveToast(null), 7000);
        }

        previousUnreadRef.current = nextUnread;
        setNotifications(nextList);
        setUnreadCount(nextUnread);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 12000); // Poll every 12 seconds
    return () => clearInterval(interval);
  }, [session]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function markAllAsRead() {
    try {
      await fetch("/api/user/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      setUnreadCount(0);
      previousUnreadRef.current = 0;
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  }

  async function markOneAsRead(id: string) {
    try {
      await fetch("/api/user/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => {
        const next = Math.max(0, prev - 1);
        previousUnreadRef.current = next;
        return next;
      });
    } catch (err) {
      console.error("Error marking read:", err);
    }
  }

  if (!session?.user) return null;

  return (
    <>
      {/* Floating Live Toast when a new question arrives */}
      {liveToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white border-2 border-sky-400 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#eaf4fe] text-[#0284c7] flex items-center justify-center shrink-0 border border-sky-200">
                <MessageSquareQuote className="h-5 w-5 animate-bounce" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-black text-[#0284c7] uppercase tracking-wider block">
                  {language === "bn" ? "নতুন প্রশ্ন এসেছে!" : "New Question Received!"}
                </span>
                <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1 mt-0.5">
                  {liveToast.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                  {liveToast.message}
                </p>
                {liveToast.link && (
                  <Link
                    href={liveToast.link}
                    onClick={() => {
                      markOneAsRead(liveToast.id);
                      setLiveToast(null);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0284c7] hover:underline mt-2"
                  >
                    <span>{language === "bn" ? "প্রশ্ন দেখুন ও উত্তর দিন" : "View & Answer Question"}</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
            <button
              onClick={() => setLiveToast(null)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bell Button */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => {
            requestBrowserPermission();
            setOpen(!open);
            if (!open) fetchNotifications();
          }}
          className="relative p-2 rounded-full border border-[#cbe2f8] hover:border-sky-400 hover:bg-[#eaf4fe] text-slate-700 hover:text-[#0284c7] transition-all shadow-xs"
          aria-label="Notifications"
          title={language === "bn" ? "নোটিফিকেশন" : "Notifications"}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white shadow-xs animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Popover */}
        {open && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-[#cbe2f8] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            
            {/* Header Banner */}
            <div className="bg-[#eaf4fe] px-4 py-3 border-b border-[#cbe2f8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#0284c7]" />
                <span className="font-bold text-[#0369a1] text-xs sm:text-sm">
                  {language === "bn" ? "বিজ্ঞাপনের প্রশ্ন ও নোটিফিকেশন" : "Questions & Alerts"}
                </span>
                {unreadCount > 0 && (
                  <span className="bg-[#0284c7] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] font-semibold text-[#0284c7] hover:text-[#0369a1] hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="h-3 w-3" />
                  <span>{language === "bn" ? "সব পঠিত" : "Mark all read"}</span>
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  {language === "bn" ? "কোনো নতুন নোটিফিকেশন নেই" : "No notifications yet"}
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (!n.read) markOneAsRead(n.id);
                    }}
                    className={`p-3.5 text-xs transition-colors hover:bg-sky-50/50 cursor-pointer ${
                      !n.read ? "bg-[#f0f7ff]" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-extrabold text-slate-900 block line-clamp-1">
                        {n.title}
                      </span>
                      {!n.read && (
                        <span className="h-2 w-2 rounded-full bg-[#0284c7] shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed mb-2">
                      {n.message}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                      {n.link && (
                        <Link
                          href={n.link}
                          onClick={() => setOpen(false)}
                          className="px-2.5 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white flex items-center gap-1 font-bold shadow-2xs"
                        >
                          <span>{language === "bn" ? "উত্তর দিন" : "Reply"}</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer: View in dashboard */}
            <div className="bg-[#f8fafc] p-2.5 border-t border-slate-100 text-center">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="text-[11px] font-bold text-[#0284c7] hover:underline"
              >
                {language === "bn" ? "ড্যাশবোর্ডে সব নোটিফিকেশন দেখুন →" : "View all in Dashboard →"}
              </Link>
            </div>

          </div>
        )}
      </div>
    </>
  );
}
