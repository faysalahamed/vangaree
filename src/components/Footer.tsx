import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col md:flex-row justify-between gap-3 px-6 md:px-12 py-7 border-t border-line text-xs text-slate-400">
      <span>© {new Date().getFullYear()} vangare.site</span>
      <div className="flex gap-4">
        <Link href="/about">About</Link>
        <Link href="/how-it-works">How it works</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </footer>
  );
}
