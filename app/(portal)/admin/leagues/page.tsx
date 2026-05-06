import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/data/dashboard";
import { createClient } from "@/lib/supabase/server";
import { LeaguesPortalClient } from "@/components/leagues/LeaguesPortalClient";
import type { League } from "@/types";

export const metadata: Metadata = { title: "Leagues" };

export default async function LeaguesPortalPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();
  const { data } = await supabase
    .from("leagues")
    .select("*")
    .eq("organization_id", profile.organization_id)
    .order("start_date", { ascending: false });

  const leagues = (data ?? []) as League[];

  return (
    <div>
      <div className="mb-6">
        <h2>Leagues</h2>
        <p className="text-sm text-muted-foreground">
          {leagues.length} league{leagues.length !== 1 ? "s" : ""} · Create and manage your organization&apos;s leagues.
        </p>
      </div>
      <LeaguesPortalClient initialLeagues={leagues} />
    </div>
  );
}
