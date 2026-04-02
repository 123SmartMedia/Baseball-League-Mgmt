import { createClient } from "@/lib/supabase/server";
import type { Tournament, Team, Game, Rule, StandingsRow } from "@/types";

export async function getTournament(id: string): Promise<Tournament | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", id)
    .single();
  return data as Tournament | null;
}

export async function getTournamentTeams(tournamentId: string): Promise<Team[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("teams")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("wins", { ascending: false });
  return (data ?? []) as Team[];
}

export async function getTournamentGames(tournamentId: string): Promise<Game[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("games")
    .select(`
      *,
      home_team:teams!games_home_team_id_fkey(id, name),
      away_team:teams!games_away_team_id_fkey(id, name)
    `)
    .eq("tournament_id", tournamentId)
    .order("scheduled_at", { ascending: true });
  return (data ?? []) as Game[];
}

export async function getTournamentStandings(tournamentId: string): Promise<StandingsRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("standings")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("win_pct", { ascending: false })
    .order("wins", { ascending: false });
  return (data ?? []) as StandingsRow[];
}

export async function getTournamentRules(tournamentId: string): Promise<Rule[]> {
  const supabase = await createClient();

  const { data: tournamentRow } = await supabase
    .from("tournaments")
    .select("organization_id, age_group")
    .eq("id", tournamentId)
    .single();

  const tournament = tournamentRow as { organization_id: string; age_group: string } | null;
  if (!tournament) return [];

  const { data } = await supabase
    .from("rules")
    .select("*")
    .eq("organization_id", tournament.organization_id)
    .or(`event_type.eq.tournament,event_type.is.null`)
    .or(`age_group.eq.${tournament.age_group},age_group.is.null`)
    .order("order_index", { ascending: true });

  return (data ?? []) as Rule[];
}

export async function getAllTournaments(): Promise<Tournament[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tournaments")
    .select("*")
    .order("start_date", { ascending: false });
  return (data ?? []) as Tournament[];
}
