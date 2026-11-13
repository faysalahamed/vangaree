"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquare, CheckCircle2, AlertCircle, Send, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

export default function ListingReviewsSection({ listingId }: { listingId: string }) {
  const { data: session } = useSession();
  const { language } = useLanguage();

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [average, setAverage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function fetchReviews() {
    try {
      const res = await fetch(`/api/listings/${listingId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setAverage(data.average || 0);
        setTotalCount(data.count || 0);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, [listingId]);

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user) return;

    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/listings/${listingId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit review");
        setSubmitting(false);
        return;
      }

      setComment("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      fetchReviews();
    } catch (err: any) {
      setError(err?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[#cbe2f8] bg-white overflow-hidden shadow-xs hover:border-sky-300 transition-all duration-200 mt-8">
      
      {/* Section Header Banner (#eaf4fe) */}
      <div className="bg-[#eaf4fe] px-5 py-3.5 border-b border-[#cbe2f8] flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-bold text-[#0369a1] tracking-tight flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          <span>{language === "bn" ? "ক্রেতা ও ব্যবহারকারী রিভিউ এবং রেটিং" : "Reviews & Ratings"}</span>
        </h2>
        {totalCount > 0 && (
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-0.5 rounded-full border border-sky-200 text-xs font-bold text-[#0369a1]">
            <span className="text-amber-500">★</span>
            <span>{average} / 5</span>
            <span className="text-slate-400 font-normal">({totalCount})</span>
          </div>
        )}
      </div>

      {/* Section Body */}
      <div className="p-5 sm:p-7 bg-white">
        
        {/* Rating Summary Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-[#f0f7fe] border border-[#cbe2f8] mb-6">
          <div className="text-center sm:border-r border-sky-200 sm:pr-8 shrink-0">
            <div className="text-4xl sm:text-5xl font-black text-slate-900 leading-none">
              {totalCount > 0 ? average : "—"}
            </div>
            <div className="flex items-center justify-center gap-1 text-amber-400 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(average) ? "fill-amber-400 text-amber-400" : "text-slate-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500 font-medium block mt-1">
              {totalCount} {language === "bn" ? "টি রিভিউ" : "reviews"}
            </span>
          </div>

          <div className="flex-1 text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-800 block mb-1">
              {language === "bn" ? "বিশ্বস্ত যন্ত্রাংশ ও পার্টস রিভিউ" : "Genuine Hardware Feedback"}
            </span>
            <p>
              {language === "bn"
                ? "যন্ত্রাংশের আসল অবস্থা, ডিসপ্লে/ব্যাটারির কার্যক্ষমতা বা বিক্রেতার সাথে ডিল কেমন ছিল সে সম্পর্কে আপনার বাস্তব অভিজ্ঞতা ও রেটিং দিন।"
                : "Rate the condition, screen quality, battery health, or overall swap/purchase experience with this hardware."}
            </p>
          </div>
        </div>

        {/* Write a Review Form */}
        <div className="mb-8 p-5 rounded-2xl bg-white border border-[#cbd5e1] hover:border-sky-300 transition-all">
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-[#0284c7]" />
            <span>{language === "bn" ? "আপনার রেটিং ও মতামত দিন" : "Leave a Rating & Review"}</span>
          </h3>

          {!session?.user ? (
            <div className="text-xs text-slate-500 py-3">
              <span>{language === "bn" ? "রিভিউ বা রেটিং দিতে অনুগ্রহ করে প্রথমে " : "Please "}</span>
              <Link href="/login" className="font-bold text-[#0284c7] hover:underline">
                {language === "bn" ? "লগইন করুন" : "Sign In"}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">
              {/* Star Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">
                  {language === "bn" ? "রেটিং নির্বাচন করুন:" : "Select Rating:"}
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (hoverRating ?? rating);
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 text-slate-300 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-6 w-6 transition-colors ${
                            isFilled ? "fill-amber-400 text-amber-400" : "text-slate-300"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-black text-[#0369a1] ml-2">
                  {rating} / 5 Stars
                </span>
              </div>

              {/* Comment Input */}
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  language === "bn"
                    ? "যন্ত্রাংশের অবস্থা এবং ফিটিং সম্পর্কে আপনার অভিজ্ঞতা লিখুন..."
                    : "Describe the component condition, working order, and transaction experience..."
                }
                className="w-full p-3 rounded-xl bg-white border border-[#cbd5e1] text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all resize-y"
              />

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{language === "bn" ? "আপনার রিভিউ সফলভাবে প্রকাশ করা হয়েছে!" : "Review submitted successfully!"}</span>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={submitting || !comment.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-sky-500/25 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{submitting ? (language === "bn" ? "জমা হচ্ছে..." : "Submitting...") : (language === "bn" ? "রিভিউ প্রকাশ করুন" : "Submit Review")}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Reviews List */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            {language === "bn" ? `প্রকাশিত রিভিউসমূহ (${reviews.length})` : `Customer Reviews (${reviews.length})`}
          </h3>

          {loading ? (
            <div className="py-6 text-center text-xs text-slate-400">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
              {language === "bn" ? "এই বিজ্ঞাপনে এখনো কোনো রিভিউ নেই। প্রথম রিভিউটি আপনিই দিন!" : "No reviews yet. Be the first to leave feedback!"}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {reviews.map((rev) => (
                <div key={rev.id} className="py-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">
                      {rev.user.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400 mb-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${
                          star <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
