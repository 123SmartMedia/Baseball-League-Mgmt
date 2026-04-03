import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/data/dashboard";
import { getOrgGames } from "@/lib/data/games";
import { getOrgTeams } from "@/lib/data/teams";
import { createClient } from "@/lib/supabase/server";
import { ScheduleClient } from "@/components/games/ScheduleClient";
import type { League, Tournament } from "@/types";

export const metadata: Metadata = { title: "Schedule" };

export default async function SchedulePage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const supabase = await createClient();
  const orgId = profile.organization_id;
  const isAdmin = profile.role === "admin";

  const [games, teams, leaguesRes, tournamentsRes] = await Promise.all([
    getOrgGames(orgId),
    isAdmin ? getOrgTeams(orgId) : Promise.resolve([]),
    isAdmin
      ? supabase.from("leagues").select("*").eq("organization_id", orgId).order("start_date", { ascending: false })
      : Promise.resolve({ data: [] }),
    isAdmin
      ? supabase.from("tournaments").select("*").eq("organization_id", orgId).order("start_date", { ascending: false })
      : Promise.resolve({ data: [] }),
  ]);

  const leagues     = ((leaguesRes as any).data     ?? []) as League[];
  const tournaments = ((tournamentsRes as any).data ?? []) as Tournament[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2>Schedule</h2>
          <p className="text-sm text-muted-foreground">
            {games.length} game{games.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <ScheduleClient
        games={games}
        isAdmin={isAdmin}
        teams={teams}
        leagues={leagues}
        tournaments={tournaments}
      />
    </div>
  );
}
