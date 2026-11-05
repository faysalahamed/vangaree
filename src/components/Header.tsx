"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetClose } from "@/components/ui/sheet";
// Note: plain <input>/<select> elements are used above instead of the Input/Select
// primitives so the search bar works as a standard form GET submit with no JS.

const DIVISIONS = ["All Bangladesh", "Dhaka", "Chattogram", "Khulna", "Rajshahi", "Sylhet", "Barishal", "Rangpur", "Mymensingh"];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
      <div className="flex items-center gap-3 px-4 md:px-12 py-4">
        <Link href="/" className="shrink-0 text-xl font-extrabold">
          <span className="text-primary">vangare</span>
          <span className="text-highlight">.site</span>
        </Link>

        <form action="/listings" className="hidden md:flex flex-1 max-w-2xl rounded-lg border border-neutral-200 overflow-hidden">
          <div className="flex items-center gap-1.5 border-r border-neutral-200 px-3 bg-neutral-50">
            <MapPin className="h-4 w-4 text-neutral-400" />
            <select name="division" className="bg-transparent text-sm text-neutral-600 outline-none" defaultValue="All Bangladesh">
              {DIVISIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <input
            name="q"
            aria-label="Search parts, devices, or repair services"
            placeholder="Search parts, brands, models…"
            className="flex-1 border-0 px-4 py-2.5 text-sm outline-none"
          />
          <button type="submit" className="bg-primary text-white px-4 flex items-center gap-1.5 text-sm font-semibold">
            <Search className="h-4 w-4" /> Search
          </button>
        </form>

        <nav className="hidden md:flex items-center gap-3 ml-auto text-sm">
          <Button asChild size="sm" variant="default">
            <Link href="/listings">Find Compatible Parts</Link>
          </Button>
          <Link href="/login" className="text-secondary font-medium hover:text-primary">
            Login
          </Link>
          <Button asChild size="sm" variant="accent">
            <Link href="/post-ad">+ Post Ad</Link>
          </Button>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden ml-auto p-2 text-primary" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="text-base font-bold text-primary mb-6">Menu</SheetTitle>
            <div className="flex flex-col gap-1 mb-6">
              {["Mobile Phones", "Mobile Displays", "Mobile Batteries", "Repair Services", "Browse All"].map((item) => (
                <SheetClose asChild key={item}>
                  <Link href="/listings" className="py-2.5 text-sm text-neutral-700 border-b border-neutral-100">
                    {item}
                  </Link>
                </SheetClose>
              ))}
            </div>
            <SheetClose asChild>
              <Button asChild className="w-full" variant="default">
                <Link href="/listings">Find Compatible Parts</Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/login" className="block py-2.5 text-sm font-medium text-secondary">
                Login
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Button asChild className="w-full mt-3" variant="accent">
                <Link href="/post-ad">+ Post Ad</Link>
              </Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile-only search row */}
      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2">
          <Search className="h-4 w-4 text-neutral-400" />
          <input
            placeholder="Search parts, brands, models…"
            className="flex-1 border-0 text-sm outline-none bg-transparent"
          />
        </div>
      </div>
    </header>
  );
}
