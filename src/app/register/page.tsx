"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", password: "", location: "" });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not create account");
      return;
    }

    const result = await signIn("credentials", {
      phone: form.phone,
      password: form.password,
      redirect: false
    });

    if (result?.error) {
      setError("Account created — please log in");
      router.push("/login");
      return;
    }

    router.push("/");
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="text-xl font-bold text-primary mb-6">Create your account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border border-line rounded-lg px-3 py-2.5 text-sm"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="border border-line rounded-lg px-3 py-2.5 text-sm"
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
        <input
          className="border border-line rounded-lg px-3 py-2.5 text-sm"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <input
          className="border border-line rounded-lg px-3 py-2.5 text-sm"
          placeholder="Location (optional)"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="bg-accent text-white rounded-lg py-3 text-sm font-bold">Create account</button>
      </form>
    </div>
  );
}
