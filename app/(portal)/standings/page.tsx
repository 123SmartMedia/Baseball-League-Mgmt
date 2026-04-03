import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/data/dashboard";
import { createClient } from "@/lib/supabase/server";
import { StandingsClient } from "@/components/standings/StandingsClient";
import type { League, Tournament, StandingsRow } from "@/types";

export const metadata: Metadata = { title: "Standings" };

export default async function StandingsPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const supabase = await createClient();
  const orgId = profile.organization_id;

  const [leaguesRes, tournamentsRes, standingsRes] = await Promise.all([
    supabase
      .from("leagues")
      .select("*")
      .eq("organization_id", orgId)
      .order("start_date", { ascending: false }),
    supabase
      .from("tournaments")
      .select("*")
      .eq("organization_id", orgId)
      .order("start_date", { ascending: false }),
    supabase
      .from("standings")
      .select("*")
      .eq("organization_id", orgId)
      .order("win_pct", { ascending: false })
      .order("wins", { ascending: false }),
  ]);

  const leagues      = (leaguesRes.data      ?? []) as League[];
  const tournaments  = (tournamentsRes.data  ?? []) as Tournament[];
  const allStandings = (standingsRes.data    ?? []) as StandingsRow[];

  // Group standings by league_id and tournament_id
  const standingsByLeague: Record<string, StandingsRow[]> = {};
  const standingsByTournament: Record<string, StandingsRow[]> = {};

  for (const row of allStandings) {
    if ((row as any).league_id) {
      const lid = (row as any).league_id as string;
      if (!standingsByLeague[lid]) standingsByLeague[lid] = [];
      standingsByLeague[lid].push(row);
    }
    if ((row as any).tournament_id) {
      const tid = (row as any).tournament_id as string;
      if (!standingsByTournament[tid]) standingsByTournament[tid] = [];
      standingsByTournament[tid].push(row);
    }
  }

  const totalLeagues     = leagues.length;
  const totalTournaments = tournaments.length;

  return (
    <div>
      <div className="mb-6">
        <h2>Standings</h2>
        <p className="text-sm text-muted-foreground">
          {totalLeagues} league{totalLeagues !== 1 ? "s" : ""} · {totalTournaments} tournament{totalTournaments !== 1 ? "s" : ""}
        </p>
      </div>

      <StandingsClient
        leagues={leagues}
        tournaments={tournaments}
        standingsByLeague={standingsByLeague}
        standingsByTournament={standingsByTournament}
      />
    </div>
  );
}
