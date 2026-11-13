"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Megaphone, Plus, RefreshCw, ExternalLink, Trash2, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface AdItem {
  id: string;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  targetUrl: string | null;
  sponsorName: string | null;
  badge: string | null;
  placement: "HOME" | "TOP_SEARCH" | "BOTH";
  priority: number;
  status: "ACTIVE" | "PAUSED" | "ENDED";
  createdAt: string;
}

export default function AdminAdsTab() {
  const { language } = useLanguage();
  const [ads, setAds] = useState<AdItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    targetUrl: "/listings",
    sponsorName: "Vangare Partner",
    badge: "স্পন্সর বিজ্ঞাপন",
    placement: "BOTH",
    priority: 10,
    status: "ACTIVE"
  });

  function showToast(message: string, type: "success" | "error" = "success") {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  }

  async function fetchAds() {
    setLoading(true);
    try {
      const res = await fetch("/api/ads?all=true");
      if (res.ok) {
        const data = await res.json();
        setAds(data.ads || []);
      }
    } catch (err) {
      console.error("Failed to load advertisements", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAds();
  }, []);

  async function handleStatusChange(id: string, newStatus: string) {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/ads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setAds((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus as any } : a))
        );
        showToast(language === "bn" ? "বিজ্ঞাপনের স্ট্যাটাস আপডেট হয়েছে।" : "Ad status updated.");
      } else {
        showToast(language === "bn" ? "স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে।" : "Failed to update status.", "error");
      }
    } catch (err) {
      showToast("Error updating ad", "error");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handlePlacementChange(id: string, newPlacement: string) {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/ads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placement: newPlacement })
      });
      if (res.ok) {
        setAds((prev) =>
          prev.map((a) => (a.id === id ? { ...a, placement: newPlacement as any } : a))
        );
        showToast(language === "bn" ? "বিজ্ঞাপনের অবস্থান আপডেট হয়েছে।" : "Placement updated.");
      }
    } catch (err) {
      showToast("Error updating ad placement", "error");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDelete(id: string) {
    const confirmMsg = language === "bn"
      ? "আপনি কি নিশ্চিতভাবে এই বিজ্ঞাপনটি ডিলিট করতে চান?"
      : "Are you sure you want to permanently delete this ad?";

    if (!window.confirm(confirmMsg)) return;

    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/ads/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAds((prev) => prev.filter((a) => a.id !== id));
        showToast(language === "bn" ? "বিজ্ঞাপন সফলভাবে মুছে ফেলা হয়েছে।" : "Advertisement deleted.");
      } else {
        showToast(language === "bn" ? "বিজ্ঞাপন মোছা যায়নি।" : "Failed to delete ad.", "error");
      }
    } catch (err) {
      showToast("Error deleting ad", "error");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const data = await res.json();
        setAds((prev) => [data.ad, ...prev]);
        setIsCreateOpen(false);
        setForm({
          title: "",
          description: "",
          imageUrl: "",
          targetUrl: "/listings",
          sponsorName: "Vangare Partner",
          badge: "স্পন্সর বিজ্ঞাপন",
          placement: "BOTH",
          priority: 10,
          status: "ACTIVE"
        });
        showToast(language === "bn" ? "নতুন বিজ্ঞাপন সফলভাবে তৈরি হয়েছে!" : "Advertisement created!");
      } else {
        showToast(language === "bn" ? "বিজ্ঞাপন তৈরি সম্ভব হয়নি।" : "Failed to create ad.", "error");
      }
    } catch (err) {
      showToast("Error creating advertisement", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
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

      {/* Main Container Card following Default Design */}
      <div className="bg-white rounded-2xl border border-[#cbe2f8] shadow-xs overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="p-4 sm:p-5 bg-[#eaf4fe] border-b border-[#cbe2f8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-[#0369a1] flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              <span>{language === "bn" ? "হোম পেজ ও টপ সার্চ বিজ্ঞাপন নিয়ন্ত্রণ" : "Homepage & Top Search Promotions"}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === "bn"
                ? "হোম পেজ ব্যানার ও টপ সার্চে স্পন্সর বিজ্ঞাপন যুক্ত বা পরিচালনা করুন।"
                : "Control promotional banners shown on the Home Page and top of Search Results."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchAds}
              className="p-2.5 rounded-xl bg-white border border-[#cbe2f8] text-slate-600 hover:text-[#0284c7] hover:border-sky-400 transition-all shadow-xs"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold transition-all shadow-sm shadow-sky-600/20 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>{language === "bn" ? "নতুন বিজ্ঞাপন তৈরি করুন" : "Create New Ad"}</span>
            </button>
          </div>
        </div>

        {/* Advertisements List */}
        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="h-6 w-6 text-[#0284c7] animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-500">
              {language === "bn" ? "বিজ্ঞাপন লোড হচ্ছে..." : "Loading advertisements..."}
            </p>
          </div>
        ) : ads.length === 0 ? (
          <div className="py-16 text-center">
            <Megaphone className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">
              {language === "bn" ? "কোনো বিজ্ঞাপন তৈরি করা নেই" : "No advertisements yet"}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {language === "bn"
                ? "হোম পেজ বা টপ সার্চে বিজ্ঞাপন প্রদর্শন করতে উপরের 'নতুন বিজ্ঞাপন তৈরি করুন' বাটনে ক্লিক করুন।"
                : "Click 'Create New Ad' above to place a sponsored ad on the homepage or top of search."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] border-b border-[#cbe2f8] text-slate-600 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">বিজ্ঞাপন ও ব্যানার ছবি</th>
                  <th className="py-3 px-4">স্পন্সর ও ব্যাজ</th>
                  <th className="py-3 px-4">প্রদর্শনের স্থান (Placement)</th>
                  <th className="py-3 px-4">অগ্রাধিকার (Priority)</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ads.map((adItem) => {
                  const isActing = actionLoadingId === adItem.id;
                  const photoUrl =
                    adItem.imageUrl ||
                    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=200&auto=format&fit=crop";

                  return (
                    <tr key={adItem.id} className="hover:bg-sky-50/30 transition-colors">
                      {/* Title & Preview */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            <Image
                              src={photoUrl}
                              alt={adItem.title || "Ad preview"}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <span className="font-extrabold text-slate-900 text-sm block truncate">
                              {adItem.title || "Untitled Promotion"}
                            </span>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {adItem.description || "No description"}
                            </p>
                            <span className="text-[10px] text-[#0284c7] font-mono block truncate">
                              🔗 {adItem.targetUrl || "/listings"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Sponsor & Badge */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">
                          {adItem.sponsorName || "Vangare Partner"}
                        </div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold">
                          {adItem.badge || "SPONSORED"}
                        </span>
                      </td>

                      {/* Placement */}
                      <td className="py-3.5 px-4">
                        <select
                          value={adItem.placement}
                          disabled={isActing}
                          onChange={(e) => handlePlacementChange(adItem.id, e.target.value)}
                          className="h-8 px-2.5 rounded-lg text-xs font-bold outline-none cursor-pointer bg-white border border-[#cbd5e1] text-slate-700 hover:border-sky-400 focus:border-sky-500 transition-all"
                        >
                          <option value="BOTH">🌟 BOTH (হোম ও সার্চ উভয়)</option>
                          <option value="HOME">🏠 HOME ONLY (শুধু হোম পেজ)</option>
                          <option value="TOP_SEARCH">🔍 TOP SEARCH (শুধু টপ সার্চ)</option>
                        </select>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-slate-800 text-xs">
                          #{adItem.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <select
                          value={adItem.status}
                          disabled={isActing}
                          onChange={(e) => handleStatusChange(adItem.id, e.target.value)}
                          className={`h-8 px-2 rounded-lg text-xs font-bold outline-none cursor-pointer border transition-all ${
                            adItem.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : adItem.status === "PAUSED"
                              ? "bg-amber-50 text-amber-700 border-amber-300"
                              : "bg-slate-100 text-slate-600 border-slate-300"
                          }`}
                        >
                          <option value="ACTIVE">🟢 ACTIVE (সচল)</option>
                          <option value="PAUSED">🟡 PAUSED (স্থগিত)</option>
                          <option value="ENDED">⚪ ENDED (সমাপ্ত)</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={adItem.targetUrl || "/listings"}
                            target="_blank"
                            title={language === "bn" ? "লিংক ভিজিট করুন" : "Open Target Link"}
                            className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-[#0284c7] flex items-center justify-center transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>

                          <button
                            type="button"
                            disabled={isActing}
                            onClick={() => handleDelete(adItem.id)}
                            title={language === "bn" ? "বিজ্ঞাপন মুছুন" : "Delete Ad"}
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

      {/* Create New Ad Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-3xl border border-[#cbe2f8] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#eaf4fe] px-6 py-4 border-b border-[#cbe2f8] flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#0369a1] flex items-center gap-2">
                <Plus className="h-5 w-5" />
                <span>{language === "bn" ? "নতুন বিজ্ঞাপন যুক্ত করুন" : "Add New Advertisement"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 rounded-lg hover:bg-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleCreate} className="p-6 overflow-y-auto space-y-4">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === "bn" ? "বিজ্ঞাপনের শিরোনাম *" : "Ad Title *"}
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder={language === "bn" ? "যেমন: অরিজিনাল ডিসপ্লে ও ব্যাটারি এক্সচেঞ্জ অফার" : "e.g. Original Display & Battery Special Offer"}
                  className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#cbd5e1] text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === "bn" ? "সংক্ষিপ্ত বিবরণ *" : "Short Description *"}
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder={language === "bn" ? "বিজ্ঞাপনটির বিস্তারিত ক্রেতাদের জানান..." : "Explain details of the promotion..."}
                  className="w-full p-3 rounded-xl bg-white border border-[#cbd5e1] text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-none hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all"
                />
              </div>

              {/* Image URL & Target Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === "bn" ? "ছবির লিংক (Image URL)" : "Banner Image URL"}
                  </label>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full h-10 px-3 rounded-xl bg-white border border-[#cbd5e1] text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === "bn" ? "ক্লিক করলে যে লিংকে যাবে (Target URL) *" : "Target Link URL *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.targetUrl}
                    onChange={(e) => setForm({ ...form, targetUrl: e.target.value })}
                    placeholder="/listings?partType=Display"
                    className="w-full h-10 px-3 rounded-xl bg-white border border-[#cbd5e1] text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all"
                  />
                </div>
              </div>

              {/* Sponsor Name & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === "bn" ? "স্পন্সরের নাম" : "Sponsor Name"}
                  </label>
                  <input
                    type="text"
                    value={form.sponsorName}
                    onChange={(e) => setForm({ ...form, sponsorName: e.target.value })}
                    placeholder="Vangare Verified Partner"
                    className="w-full h-10 px-3 rounded-xl bg-white border border-[#cbd5e1] text-xs font-semibold text-slate-900 outline-none hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === "bn" ? "ব্যাজ টেক্সট" : "Badge Label"}
                  </label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="স্পন্সর বিজ্ঞাপন / SPONSORED"
                    className="w-full h-10 px-3 rounded-xl bg-white border border-[#cbd5e1] text-xs font-semibold text-slate-900 outline-none hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all"
                  />
                </div>
              </div>

              {/* Placement & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === "bn" ? "প্রদর্শনের স্থান (Placement)" : "Placement Location"}
                  </label>
                  <select
                    value={form.placement}
                    onChange={(e) => setForm({ ...form, placement: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-xl bg-white border border-[#cbd5e1] text-xs font-semibold text-slate-900 outline-none hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all cursor-pointer"
                  >
                    <option value="BOTH">🌟 BOTH (হোম ও সার্চ উভয় জায়গায়)</option>
                    <option value="HOME">🏠 HOME ONLY (শুধু হোম পেজে)</option>
                    <option value="TOP_SEARCH">🔍 TOP SEARCH (শুধু টপ সার্চে)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === "bn" ? "অগ্রাধিকার (Priority - বেশি সংখ্যা উপরে থাকবে)" : "Priority (Higher shows first)"}
                  </label>
                  <input
                    type="number"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
                    className="w-full h-10 px-3 rounded-xl bg-white border border-[#cbd5e1] text-xs font-semibold text-slate-900 outline-none hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  {language === "bn" ? "বাতিল" : "Cancel"}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold transition-all shadow-md shadow-sky-600/20 active:scale-95 disabled:opacity-50"
                >
                  {submitting
                    ? (language === "bn" ? "তৈরি হচ্ছে..." : "Creating...")
                    : (language === "bn" ? "বিজ্ঞাপন প্রকাশ করুন" : "Publish Advertisement")}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
