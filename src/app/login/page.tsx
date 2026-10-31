"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await signIn("credentials", { phone, password, redirect: false });

    setSubmitting(false);

    if (result?.error) {
      setError("Incorrect phone number or password");
      return;
    }

    router.push("/");
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="text-xl font-bold text-primary mb-6">Log in</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border border-line rounded-lg px-3 py-2.5 text-sm"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          className="border border-line rounded-lg px-3 py-2.5 text-sm"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={submitting} className="bg-accent text-white rounded-lg py-3 text-sm font-bold disabled:opacity-60">
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="text-sm text-slate-500 mt-5">
        No account yet?{" "}
        <Link href="/register" className="text-secondary font-semibold">
          Register
        </Link>
      </p>
    </div>
  );
}
