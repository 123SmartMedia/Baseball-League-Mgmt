"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/Button";

interface PortalTopbarProps {
  userName?: string;
}

export function PortalTopbar({ userName }: PortalTopbarProps) {
  const supabase = useSupabase();
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      {/* Mobile logo */}
      <span className="text-base font-bold lg:hidden">League Platform</span>

      <div className="ml-auto flex items-center gap-4">
        {userName && (
          <Link
            href="/profile"
            className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {userName}
          </Link>
        )}
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </header>
  );
}
