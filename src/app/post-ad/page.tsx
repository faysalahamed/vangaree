"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const TYPES = [
  { value: "SELL", label: "Sell a Part" },
  { value: "BUY", label: "Need a Part" },
  { value: "REPAIR_OFFER", label: "Offer Repair" },
  { value: "REPAIR_REQUEST", label: "Need Repair" }
];

export default function PostAdPage() {
  const router = useRouter();
  const [listingType, setListingType] = useState("SELL");
  const [form, setForm] = useState({
    partType: "Display",
    phoneBrand: "",
    phoneModel: "",
    condition: "NEW",
    price: "",
    location: "",
    description: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const path = `${crypto.randomUUID()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("listing-photos")
          .upload(path, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("listing-photos").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      setPhotoUrls((prev) => [...prev, ...uploaded]);
    } catch {
      setError("Couldn't upload one or more photos. Make sure the 'listing-photos' bucket exists and is public.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingType, ...form, photoUrls })
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    const listing = await res.json();
    router.push(`/listings/${listing.id}`);
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-primary mb-1">Post an Ad</h1>
      <p className="text-sm text-slate-500 mb-7">Takes about 2 minutes</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block text-sm font-semibold text-primary mb-1.5">What do you want to do?</label>
          <div className="flex gap-2.5 flex-wrap">
            {TYPES.map((t) => (
              <button
                type="button"
                key={t.value}
                onClick={() => setListingType(t.value)}
                className={`flex-1 border-2 rounded-lg p-3.5 text-sm font-semibold text-primary ${
                  listingType === t.value ? "border-secondary bg-sky-50" : "border-line"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <Field label="Part type">
            <select
              className="w-full border border-line rounded-lg px-3 py-2.5 text-sm"
              value={form.partType}
              onChange={(e) => setForm({ ...form, partType: e.target.value })}
            >
              {["Display", "Battery", "Camera", "Charging Port", "Speaker", "Back Panel"].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>
          <Field label="Phone brand">
            <input
              className="w-full border border-line rounded-lg px-3 py-2.5 text-sm"
              placeholder="e.g. Samsung"
              value={form.phoneBrand}
              onChange={(e) => setForm({ ...form, phoneBrand: e.target.value })}
              required
            />
          </Field>
          <Field label="Phone model">
            <input
              className="w-full border border-line rounded-lg px-3 py-2.5 text-sm"
              placeholder="e.g. Galaxy A33"
              value={form.phoneModel}
              onChange={(e) => setForm({ ...form, phoneModel: e.target.value })}
              required
            />
          </Field>
          <Field label="Condition">
            <select
              className="w-full border border-line rounded-lg px-3 py-2.5 text-sm"
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
            >
              <option value="NEW">New</option>
              <option value="USED_GOOD">Used — Good</option>
              <option value="USED_FAIR">Used — Fair</option>
              <option value="FOR_PARTS">For Parts</option>
            </select>
          </Field>
        </div>

        <Field label="Price (BDT)">
          <input
            className="w-full border border-line rounded-lg px-3 py-2.5 text-sm mb-5"
            placeholder="e.g. 2200 or leave blank for Negotiable"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </Field>

        <Field label="Location">
          <input
            className="w-full border border-line rounded-lg px-3 py-2.5 text-sm mb-5"
            placeholder="Area, city"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
        </Field>

        <Field label="Description">
          <textarea
            className="w-full border border-line rounded-lg px-3 py-2.5 text-sm mb-6"
            rows={4}
            placeholder="Describe the part's condition and anything buyers should know"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </Field>

        <Field label="Photos">
          <div className="border-2 border-dashed border-line rounded-lg p-6 text-center text-sm text-slate-400 mb-3">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoSelect}
              className="text-xs"
            />
            {uploading && <p className="mt-2 text-xs text-secondary">Uploading…</p>}
          </div>
          {photoUrls.length > 0 && (
            <div className="flex gap-2 mb-5 flex-wrap">
              {photoUrls.map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={url} src={url} alt="" className="w-16 h-16 object-cover rounded-lg border border-line" />
              ))}
            </div>
          )}
        </Field>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={submitting || uploading}
          className="w-full bg-accent text-white rounded-lg py-4 text-sm font-bold disabled:opacity-60"
        >
          {submitting ? "Publishing…" : "Publish Listing"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-primary mb-1.5">{label}</label>
      {children}
    </div>
  );
}
