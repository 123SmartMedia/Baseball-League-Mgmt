import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/data/dashboard";
import { createClient } from "@/lib/supabase/server";
import { TournamentsPortalClient } from "@/components/tournaments/TournamentsPortalClient";
import type { Tournament } from "@/types";

export const metadata: Metadata = { title: "Tournaments" };

export default async function TournamentsPortalPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();
  const { data } = await supabase
    .from("tournaments")
    .select("*")
    .eq("organization_id", profile.organization_id)
    .order("start_date", { ascending: false });

  const tournaments = (data ?? []) as Tournament[];

  return (
    <div>
      <div className="mb-6">
        <h2>Tournaments</h2>
        <p className="text-sm text-muted-foreground">
          {tournaments.length} tournament{tournaments.length !== 1 ? "s" : ""} · Create and manage your organization&apos;s tournaments.
        </p>
      </div>
      <TournamentsPortalClient initialTournaments={tournaments} />
    </div>
  );
}
