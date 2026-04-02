"use client";

import { useRouter } from "next/navigation";
import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/Button";

export function PortalTopbar() {
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

      <div className="ml-auto flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </header>
  );
}
