"use client";

import { useState } from "react";
import Link from "next/link";
import { PUBLIC_NAV } from "@/config/nav";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="container-app flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold">
          League Platform
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="tap-target flex items-center justify-center md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="text-xl">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile slide-out */}
      {menuOpen && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-base font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <Button className="w-full">Sign In</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
