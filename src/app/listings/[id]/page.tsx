import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Tag, MapPin, Calendar, CheckCircle2, ShieldCheck, Phone, MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ViewLogger from "@/components/ViewLogger";
import ListingReviewsSection from "@/components/listing/ListingReviewsSection";
import ListingQuestionsSection from "@/components/listing/ListingQuestionsSection";

const TYPE_LABEL: Record<string, string> = {
  SELL: "For Sale",
  BUY: "Looking to Buy",
  REPAIR_OFFER: "Repair Service",
  REPAIR_REQUEST: "Needs Repair"
};

export default async function ListingDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { sortOrder: "asc" } },
      user: { select: { id: true, name: true, location: true, createdAt: true, phone: true } }
    }
  });

  if (!listing) notFound();

  // Extract tags if present (e.g. "Tags: #tag1 #tag2")
  const tagsMatch = listing.description.match(/(?:Tags:\s*)(#\S+(?:\s+#\S+)*)/i);
  let tags: string[] = [];
  let cleanDescription = listing.description;
  if (tagsMatch) {
    tags = tagsMatch[1].split(/\s+/).filter(Boolean);
    cleanDescription = listing.description.replace(/(?:Tags:\s*)(#\S+(?:\s+#\S+)*)/i, "").trim();
  } else {
    const allHashtags = listing.description.match(/#[\w\u0980-\u09FF-]+/g);
    if (allHashtags && allHashtags.length > 0) {
      tags = Array.from(new Set(allHashtags));
    }
  }

  return (
    <div className="bg-[#ddf1fd] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <ViewLogger listingId={listing.id} partType={listing.partType} phoneBrand={listing.phoneBrand} />

        <div className="grid md:grid-cols-[1.4fr_1fr] gap-8 items-start">
          
          {/* Left Column: Photos, Description, Details, Q&A, and Reviews */}
          <div>
            {/* Main Photo & Thumbnails Card */}
            <div className="rounded-2xl border border-[#cbe2f8] bg-white p-4 shadow-xs overflow-hidden mb-6">
              <div className="h-80 sm:h-96 bg-slate-100 rounded-xl mb-3 relative overflow-hidden flex items-center justify-center text-slate-400">
                {listing.photos[0] ? (
                  <Image src={listing.photos[0].url} alt={listing.phoneModel} fill priority className="object-contain" />
                ) : (
                  <span>No photo available</span>
                )}
              </div>
              {listing.photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {listing.photos.map((p: (typeof listing.photos)[number]) => (
                    <div key={p.id} className="w-20 h-20 bg-slate-100 rounded-lg relative overflow-hidden shrink-0 border border-slate-200">
                      <Image src={p.url} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description & Component Details Card */}
            <div className="rounded-2xl border border-[#cbe2f8] bg-white overflow-hidden shadow-xs hover:border-sky-300 transition-all">
              <div className="bg-[#eaf4fe] px-5 py-3.5 border-b border-[#cbe2f8] flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-bold text-[#0369a1] tracking-tight">
                  যন্ত্রাংশ ও ত্রুটির বিস্তারিত বিবরণ (Details)
                </h2>
              </div>
              
              <div className="p-5 sm:p-7 bg-white">
                <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line mb-6">
                  {cleanDescription}
                </p>

                {tags.length > 0 && (
                  <div className="mb-6 pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#0284c7]" />
                      <span>Search Tags</span>
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/listings?q=${encodeURIComponent(tag.replace(/^#/, ""))}`}
                          className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0284c7] text-xs font-semibold border border-sky-200 transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    যন্ত্রাংশের বিবরণ (Specifications)
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">যন্ত্রাংশের ধরন</span>
                      <strong className="text-slate-900">{listing.partType}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">মডেল ফিটিং</span>
                      <strong className="text-slate-900">{listing.phoneBrand} {listing.phoneModel}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">যন্ত্রাংশের অবস্থা</span>
                      <strong className="text-slate-900">{listing.condition.replace("_", " ")}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[11px]">বিজ্ঞাপনের তারিখ</span>
                      <strong className="text-slate-900">{listing.createdAt.toLocaleDateString()}</strong>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Questions Section (Q&A / Comments on Post) */}
            <ListingQuestionsSection listingId={listing.id} sellerId={listing.user.id} />

            {/* Reviews & Ratings Section on Post */}
            <ListingReviewsSection listingId={listing.id} />

          </div>

          {/* Right Column: Pricing, Seller Info & Action Card */}
          <div className="sticky top-6">
            <div className="rounded-2xl border border-[#cbe2f8] bg-white p-6 shadow-xs">
              <span className="inline-block text-xs font-bold rounded-full px-3 py-1 bg-sky-50 text-[#0284c7] border border-sky-200 mb-3">
                {TYPE_LABEL[listing.listingType]}
              </span>
              
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                {listing.phoneBrand} {listing.phoneModel} {listing.partType}
              </h1>

              {listing.price != null ? (
                <div className="text-3xl font-black text-[#0284c7] mb-1">
                  ৳ {Number(listing.price).toLocaleString()}
                </div>
              ) : (
                <div className="text-xl font-bold text-[#0284c7] mb-1">
                  বিনিময় / আলোচনা সাপেক্ষে
                </div>
              )}

              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>{listing.location}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                <a
                  href={`tel:${listing.user.phone}`}
                  className="w-full py-3 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] active:scale-95 text-white font-bold text-sm shadow-md shadow-sky-500/25 flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="h-4 w-4" />
                  <span>সেলারকে কল করুন ({listing.user.phone})</span>
                </a>
              </div>

              {/* Seller Profile Summary */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#eaf4fe] text-[#0284c7] font-black text-lg flex items-center justify-center border border-sky-200 shrink-0">
                  {listing.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{listing.user.name}</div>
                  <div className="text-xs text-slate-400">
                    সদস্য {listing.user.createdAt.getFullYear()} সাল থেকে
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
