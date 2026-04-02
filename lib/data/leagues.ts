import { createClient } from "@/lib/supabase/server";
import type { League, Team, Game, Rule, StandingsRow } from "@/types";

export async function getLeague(id: string): Promise<League | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leagues")
    .select("*")
    .eq("id", id)
    .single();
  return data as League | null;
}

export async function getLeagueTeams(leagueId: string): Promise<Team[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("teams")
    .select("*")
    .eq("league_id", leagueId)
    .order("wins", { ascending: false });
  return (data ?? []) as Team[];
}

export async function getLeagueGames(leagueId: string): Promise<Game[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("games")
    .select(`
      *,
      home_team:teams!games_home_team_id_fkey(id, name),
      away_team:teams!games_away_team_id_fkey(id, name)
    `)
    .eq("league_id", leagueId)
    .order("scheduled_at", { ascending: true });
  return (data ?? []) as Game[];
}

export async function getLeagueStandings(leagueId: string): Promise<StandingsRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("standings")
    .select("*")
    .eq("league_id", leagueId)
    .order("win_pct", { ascending: false })
    .order("wins", { ascending: false });
  return (data ?? []) as StandingsRow[];
}

export async function getLeagueRules(leagueId: string): Promise<Rule[]> {
  const supabase = await createClient();

  // Fetch the league to get its age_group
  const { data: leagueRow } = await supabase
    .from("leagues")
    .select("organization_id, age_group")
    .eq("id", leagueId)
    .single();

  const league = leagueRow as { organization_id: string; age_group: string } | null;
  if (!league) return [];

  const { data } = await supabase
    .from("rules")
    .select("*")
    .eq("organization_id", league.organization_id)
    .or(`event_type.eq.league,event_type.is.null`)
    .or(`age_group.eq.${league.age_group},age_group.is.null`)
    .order("order_index", { ascending: true });

  return (data ?? []) as Rule[];
}
