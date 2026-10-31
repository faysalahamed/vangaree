import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-line bg-white">
      <Link href="/" className="text-xl font-extrabold">
        <span className="text-primary">vangare</span>
        <span className="text-highlight">.site</span>
      </Link>

      <form action="/listings" className="hidden md:flex flex-1 max-w-md mx-8 border border-line rounded-lg overflow-hidden">
        <input
          name="q"
          aria-label="Search parts or repair services"
          placeholder="Search parts, brands, models…"
          className="flex-1 border-0 px-4 py-2.5 text-sm outline-none"
        />
        <button type="submit" className="bg-primary text-white px-4 text-sm">
          Search
        </button>
      </form>

      <nav className="flex items-center gap-5 text-sm">
        <Link href="/login" className="text-secondary hover:text-primary">
          Login
        </Link>
        <Link
          href="/post-ad"
          className="bg-accent text-white rounded-lg px-4 py-2.5 font-semibold hover:opacity-90"
        >
          + Post Ad
        </Link>
      </nav>
    </header>
  );
}
