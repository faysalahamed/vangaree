"use client";

import { useEffect, useState } from "react";
import { HelpCircle, MessageCircle, Send, CheckCircle2, AlertCircle, CornerDownRight, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface QuestionItem {
  id: string;
  question: string;
  answer: string | null;
  answeredAt: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

export default function ListingQuestionsSection({
  listingId,
  sellerId
}: {
  listingId: string;
  sellerId: string;
}) {
  const { data: session } = useSession();
  const { language } = useLanguage();

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reply state for seller
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);

  const isSeller = session?.user && (session.user as { id?: string }).id === sellerId;

  async function fetchQuestions() {
    try {
      const res = await fetch(`/api/listings/${listingId}/questions`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data || []);
      }
    } catch (err) {
      console.error("Failed to load questions:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, [listingId]);

  async function handleQuestionSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user) return;

    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/listings/${listingId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newQuestion })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit question");
        setSubmitting(false);
        return;
      }

      setNewQuestion("");
      fetchQuestions();
    } catch (err: any) {
      setError(err?.message || "Failed to submit question");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAnswerSubmit(questionId: string) {
    if (!replyText.trim()) return;

    setReplySubmitting(true);

    try {
      const res = await fetch(`/api/listings/${listingId}/questions/${questionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: replyText })
      });

      if (res.ok) {
        setReplyingId(null);
        setReplyText("");
        fetchQuestions();
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
    } finally {
      setReplySubmitting(false);
    }
  }

  return (
    <div id="questions" className="scroll-mt-24 rounded-2xl border border-[#cbe2f8] bg-white overflow-hidden shadow-xs hover:border-sky-300 transition-all duration-200 mt-8">
      
      {/* Section Header Banner (#eaf4fe) */}
      <div className="bg-[#eaf4fe] px-5 py-3.5 border-b border-[#cbe2f8] flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-bold text-[#0369a1] tracking-tight flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-[#0284c7]" />
          <span>{language === "bn" ? "যন্ত্রাংশ সম্পর্কিত প্রশ্ন ও উত্তর (Q&A)" : "Questions & Answers (Q&A)"}</span>
        </h2>
        <span className="text-xs font-bold text-[#0369a1] bg-white px-2.5 py-0.5 rounded-full border border-sky-200">
          {questions.length} {language === "bn" ? "টি প্রশ্ন" : "questions"}
        </span>
      </div>

      {/* Section Body */}
      <div className="p-5 sm:p-7 bg-white">
        
        {/* Ask Question Form */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-[#f0f7fe] border border-[#cbe2f8]">
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4 text-[#0284c7]" />
            <span>{language === "bn" ? "সেলারকে কোনো প্রশ্ন করতে চান?" : "Ask the Seller a Question"}</span>
          </h3>

          {!session?.user ? (
            <div className="text-xs text-slate-500 py-2">
              <span>{language === "bn" ? "প্রশ্ন করতে অনুগ্রহ করে " : "Please "}</span>
              <Link href="/login" className="font-bold text-[#0284c7] hover:underline">
                {language === "bn" ? "লগইন করুন" : "Sign In"}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleQuestionSubmit} className="flex flex-col gap-2.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder={
                    language === "bn"
                      ? "যেমন: ডিসপ্লেটি কি অরিজিনাল? কোনো স্পট বা স্ক্র্যাচ আছে কি না?"
                      : "e.g. Is this original display? Any dead pixels or scratches?"
                  }
                  className="flex-1 h-11 px-3.5 rounded-xl bg-white border border-[#cbd5e1] text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none hover:border-sky-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all"
                />
                <button
                  type="submit"
                  disabled={submitting || !newQuestion.trim()}
                  className="h-11 px-4 sm:px-5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-sky-500/25 transition-all disabled:opacity-50 cursor-pointer shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{language === "bn" ? "প্রশ্ন পাঠান" : "Ask"}</span>
                </button>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Questions List */}
        <div>
          {loading ? (
            <div className="py-6 text-center text-xs text-slate-400">Loading questions...</div>
          ) : questions.length === 0 ? (
            <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
              {language === "bn" ? "এখনো কোনো প্রশ্ন করা হয়নি। আপনার কোনো জিজ্ঞাসা থাকলে প্রথম প্রশ্নটি আপনিই করুন!" : "No questions yet. Be the first to ask!"}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {questions.map((q) => (
                <div key={q.id} className="py-4">
                  {/* Question */}
                  <div className="flex items-start gap-2.5 mb-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                      Q
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-800 text-xs sm:text-sm">
                          {q.user.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(q.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 mt-0.5 leading-relaxed">
                        {q.question}
                      </p>
                    </div>
                  </div>

                  {/* Answer (if present) */}
                  {q.answer ? (
                    <div className="ml-8 mt-2.5 p-3 rounded-xl bg-sky-50/60 border border-sky-100 flex items-start gap-2.5">
                      <CornerDownRight className="h-4 w-4 text-[#0284c7] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#0369a1] bg-white px-2 py-0.2 rounded-full border border-sky-200">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            <span>{language === "bn" ? "সেলার উত্তর দিয়েছেন" : "Seller Answer"}</span>
                          </span>
                          {q.answeredAt && (
                            <span className="text-[10px] text-slate-400">
                              {new Date(q.answeredAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 mt-1 leading-relaxed">
                          {q.answer}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Seller reply form if seller is logged in and question is unanswered */
                    isSeller && (
                      <div className="ml-8 mt-2">
                        {replyingId === q.id ? (
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                            <textarea
                              rows={2}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={language === "bn" ? "ক্রেতার প্রশ্নের উত্তর লিখুন..." : "Type your answer..."}
                              className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-xs outline-none hover:border-sky-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyingId(null);
                                  setReplyText("");
                                }}
                                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200"
                              >
                                {language === "bn" ? "বাতিল" : "Cancel"}
                              </button>
                              <button
                                type="button"
                                disabled={replySubmitting || !replyText.trim()}
                                onClick={() => handleAnswerSubmit(q.id)}
                                className="px-4 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold transition-all disabled:opacity-50"
                              >
                                {replySubmitting ? "Sending..." : (language === "bn" ? "উত্তর দিন" : "Reply")}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingId(q.id);
                              setReplyText("");
                            }}
                            className="text-xs font-bold text-[#0284c7] hover:underline flex items-center gap-1"
                          >
                            <CornerDownRight className="h-3.5 w-3.5" />
                            <span>{language === "bn" ? "উত্তর প্রদান করুন (সেলার হিসেবে)" : "Reply as Seller"}</span>
                          </button>
                        )}
                      </div>
                    )
                  )}

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
