"use client";

import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Eye,
  Users,
  Smartphone,
  Monitor,
  RefreshCw,
  Clock,
  Globe,
  TrendingUp
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface AnalyticsData {
  summary: {
    totalEvents: number;
    totalSearches: number;
    totalViews: number;
    uniqueVisitors: number;
  };
  topSearches: { term: string; count: number }[];
  topLocations: { location: string; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
  recentSearches: {
    id: string;
    searchQuery: string | null;
    partType: string | null;
    phoneBrand: string | null;
    location: string | null;
    ipAddress: string | null;
    city: string | null;
    country: string | null;
    deviceType: string | null;
    createdAt: string;
    user: { name: string; phone: string } | null;
  }[];
  recentVisits: {
    id: string;
    pageUrl: string | null;
    ipAddress: string | null;
    city: string | null;
    country: string | null;
    deviceType: string | null;
    createdAt: string;
    user: { name: string; phone: string } | null;
  }[];
}

export default function AdminAnalyticsTab() {
  const { language } = useLanguage();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [logView, setLogView] = useState<"searches" | "visits">("searches");

  async function fetchAnalytics() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading && !data) {
    return (
      <div className="bg-white rounded-2xl border border-[#cbe2f8] p-16 text-center shadow-xs">
        <RefreshCw className="h-7 w-7 text-[#0284c7] animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-500">
          {language === "bn" ? "ভিজিটর ও সার্চ তথ্য লোড হচ্ছে..." : "Loading visitor & search analytics..."}
        </p>
      </div>
    );
  }

  const maxSearchCount = data?.topSearches?.[0]?.count || 1;

  return (
    <div className="space-y-6">
      
      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#cbe2f8] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">
              {language === "bn" ? "মোট সার্চ" : "Total Searches"}
            </span>
            <div className="p-2 rounded-xl bg-[#eaf4fe] text-[#0284c7]">
              <Search className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {data?.summary.totalSearches ?? 0}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#cbe2f8] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">
              {language === "bn" ? "পেজ ভিজিট" : "Page Views"}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {data?.summary.totalViews ?? 0}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#cbe2f8] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">
              {language === "bn" ? "ইউনিক ভিজিটর" : "Unique Sessions"}
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600">
            {data?.summary.uniqueVisitors ?? 0}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#cbe2f8] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">
              {language === "bn" ? "শীর্ষ লোকেশন" : "Top Location"}
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <MapPin className="h-4 w-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900 truncate mt-1">
            {data?.topLocations?.[0]?.location || "—"}
          </div>
        </div>
      </div>

      {/* 2-Column Insights: Top Searches & Top Browsing Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Searched Keywords */}
        <div className="bg-white rounded-2xl border border-[#cbe2f8] shadow-xs overflow-hidden">
          <div className="bg-[#eaf4fe] px-5 py-3.5 border-b border-[#cbe2f8] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0369a1] flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>{language === "bn" ? "মানুষ যা বেশি খুঁজছে (Top Searches)" : "Top Searched Terms"}</span>
            </h3>
            <button
              type="button"
              onClick={fetchAnalytics}
              className="p-1 rounded-lg bg-white border border-sky-200 text-[#0284c7] hover:bg-sky-50"
              title="Refresh"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
          <div className="p-5">
            {!data?.topSearches?.length ? (
              <p className="text-xs text-slate-400 text-center py-6">
                {language === "bn" ? "এখনও কোনো সার্চ রেকর্ড হয়নি।" : "No search queries recorded yet."}
              </p>
            ) : (
              <div className="space-y-3">
                {data.topSearches.map((item) => {
                  const pct = Math.max(8, Math.round((item.count / maxSearchCount) * 100));
                  return (
                    <div key={item.term}>
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-slate-800">{item.term}</span>
                        <span className="text-[#0284c7]">{item.count} {language === "bn" ? "বার" : "searches"}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#eaf4fe] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#1d9bf0] to-[#0284c7] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Browsing Locations & Devices */}
        <div className="bg-white rounded-2xl border border-[#cbe2f8] shadow-xs overflow-hidden">
          <div className="bg-[#eaf4fe] px-5 py-3.5 border-b border-[#cbe2f8]">
            <h3 className="text-sm font-bold text-[#0369a1] flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{language === "bn" ? "কোথা থেকে ব্রাউজ করছে (Locations & Devices)" : "Browsing Locations & Devices"}</span>
            </h3>
          </div>
          <div className="p-5 space-y-5">
            {/* Locations list */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                {language === "bn" ? "লোকেশন অনুযায়ী ভিজিটর" : "Visitors by Location"}
              </span>
              {!data?.topLocations?.length ? (
                <p className="text-xs text-slate-400">No location data yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.topLocations.map((loc) => (
                    <div
                      key={loc.location}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fbff] border border-[#dbeafe] text-xs"
                    >
                      <span className="font-bold text-slate-800 flex items-center gap-1.5 truncate">
                        <MapPin className="h-3.5 w-3.5 text-[#0284c7] shrink-0" />
                        <span className="truncate">{loc.location}</span>
                      </span>
                      <span className="font-extrabold text-[#0284c7] ml-2">{loc.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Devices breakdown */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                {language === "bn" ? "ডিভাইস ব্যবহার" : "Device Breakdown"}
              </span>
              <div className="flex flex-wrap gap-2.5">
                {data?.deviceBreakdown?.map((d) => (
                  <div
                    key={d.device}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#eaf4fe] border border-[#cbe2f8] text-xs font-bold text-[#0369a1]"
                  >
                    {d.device === "Mobile" ? (
                      <Smartphone className="h-3.5 w-3.5" />
                    ) : (
                      <Monitor className="h-3.5 w-3.5" />
                    )}
                    <span>{d.device}:</span>
                    <span className="font-black text-slate-900">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Detailed Logs Table Card */}
      <div className="bg-white rounded-2xl border border-[#cbe2f8] shadow-xs overflow-hidden">
        <div className="bg-[#eaf4fe] px-5 py-3.5 border-b border-[#cbe2f8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-[#0369a1]">
            {language === "bn" ? "বিস্তারিত অ্যাক্টিভিটি লগ (Live Logs)" : "Detailed Activity Logs"}
          </h3>

          <div className="inline-flex bg-white p-1 rounded-xl border border-[#cbe2f8]">
            <button
              type="button"
              onClick={() => setLogView("searches")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                logView === "searches"
                  ? "bg-[#0284c7] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🔍 {language === "bn" ? "সার্চ লগ" : "Search Logs"}
            </button>
            <button
              type="button"
              onClick={() => setLogView("visits")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                logView === "visits"
                  ? "bg-[#0284c7] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🌐 {language === "bn" ? "ভিজিটর লগ" : "Browse Locations"}
            </button>
          </div>
        </div>

        {/* Search Logs Table */}
        {logView === "searches" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] border-b border-[#cbe2f8] text-slate-600 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">{language === "bn" ? "সার্চ করা শব্দ / ফিল্টার" : "Searched Query / Filter"}</th>
                  <th className="py-3 px-4">{language === "bn" ? "ব্যবহারকারী" : "User"}</th>
                  <th className="py-3 px-4">{language === "bn" ? "কোথা থেকে (লোকেশন ও IP)" : "Browsing From"}</th>
                  <th className="py-3 px-4">{language === "bn" ? "ডিভাইস" : "Device"}</th>
                  <th className="py-3 px-4">{language === "bn" ? "সময়" : "Time"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!data?.recentSearches?.length ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400">
                      {language === "bn" ? "কোনো সার্চ লগ পাওয়া যায়নি।" : "No search logs recorded yet."}
                    </td>
                  </tr>
                ) : (
                  data.recentSearches.map((s) => (
                    <tr key={s.id} className="hover:bg-sky-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900">
                          {s.searchQuery || s.partType || s.phoneBrand || "Filter Search"}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {s.partType && (
                            <span className="px-1.5 py-0.5 rounded bg-sky-50 text-[#0284c7] text-[10px] font-bold">
                              Part: {s.partType}
                            </span>
                          )}
                          {s.phoneBrand && (
                            <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                              Brand: {s.phoneBrand}
                            </span>
                          )}
                          {s.location && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                              Filter Loc: {s.location}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {s.user ? (
                          <div>
                            <div className="font-bold text-slate-800">{s.user.name}</div>
                            <div className="text-[10px] font-mono text-slate-500">{s.user.phone}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Guest Visitor</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#0284c7]" />
                          <span>{s.city ? `${s.city}${s.country ? `, ${s.country}` : ""}` : "Unknown"}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">{s.ipAddress || "—"}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-600">
                        {s.deviceType || "Desktop"}
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>{new Date(s.createdAt).toLocaleString()}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Browsing / Visit Logs Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] border-b border-[#cbe2f8] text-slate-600 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">{language === "bn" ? "ভিজিট করা পেজ" : "Visited Page"}</th>
                  <th className="py-3 px-4">{language === "bn" ? "ব্যবহারকারী" : "User"}</th>
                  <th className="py-3 px-4">{language === "bn" ? "কোথা থেকে (লোকেশন ও IP)" : "Browsing From"}</th>
                  <th className="py-3 px-4">{language === "bn" ? "ডিভাইস" : "Device"}</th>
                  <th className="py-3 px-4">{language === "bn" ? "সময়" : "Time"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!data?.recentVisits?.length ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400">
                      {language === "bn" ? "কোনো ভিজিট লগ পাওয়া যায়নি।" : "No page visits recorded yet."}
                    </td>
                  </tr>
                ) : (
                  data.recentVisits.map((v) => (
                    <tr key={v.id} className="hover:bg-sky-50/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#0284c7]">
                        {v.pageUrl || "/"}
                      </td>
                      <td className="py-3 px-4">
                        {v.user ? (
                          <div>
                            <div className="font-bold text-slate-800">{v.user.name}</div>
                            <div className="text-[10px] font-mono text-slate-500">{v.user.phone}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Guest Visitor</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#0284c7]" />
                          <span>{v.city ? `${v.city}${v.country ? `, ${v.country}` : ""}` : "Unknown"}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">{v.ipAddress || "—"}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-600">
                        {v.deviceType || "Desktop"}
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>{new Date(v.createdAt).toLocaleString()}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
