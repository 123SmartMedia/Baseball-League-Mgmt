import { createClient } from "@/lib/supabase/server";
import type { Game, Team, Profile } from "@/types";

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as Profile | null;
}

export async function getDashboardGames(
  organizationId: string,
  coachId: string | null,
  role: "admin" | "coach"
): Promise<{ upcoming: Game[]; recent: Game[] }> {
  const supabase = await createClient();

  let query = supabase
    .from("games")
    .select(`
      *,
      home_team:teams!games_home_team_id_fkey(id, name),
      away_team:teams!games_away_team_id_fkey(id, name)
    `)
    .eq("organization_id", organizationId);

  // Coaches only see games for their team
  if (role === "coach" && coachId) {
    const { data: coachTeams } = await supabase
      .from("teams")
      .select("id")
      .eq("coach_id", coachId);

    const teamIds = (coachTeams ?? []).map((t: { id: string }) => t.id);
    if (teamIds.length > 0) {
      query = query.or(
        teamIds.map((id) => `home_team_id.eq.${id},away_team_id.eq.${id}`).join(",")
      );
    }
  }

  const { data: allGames } = await query.order("scheduled_at", { ascending: true });
  const games = (allGames ?? []) as Game[];

  const now = new Date().toISOString();
  const upcoming = games
    .filter((g) => g.status === "scheduled" && g.scheduled_at >= now)
    .slice(0, 5);
  const recent = games
    .filter((g) => g.status === "final")
    .slice(-5)
    .reverse();

  return { upcoming, recent };
}

export async function getDashboardTeams(
  organizationId: string,
  coachId: string | null,
  role: "admin" | "coach"
): Promise<Team[]> {
  const supabase = await createClient();

  let query = supabase
    .from("teams")
    .select("*")
    .eq("organization_id", organizationId)
    .order("wins", { ascending: false });

  if (role === "coach" && coachId) {
    query = query.eq("coach_id", coachId);
  }

  const { data } = await query;
  return (data ?? []) as Team[];
}

export async function getDashboardStats(organizationId: string) {
  const supabase = await createClient();

  const [teamsRes, gamesRes, upcomingRes] = await Promise.all([
    supabase.from("teams").select("id", { count: "exact", head: true }).eq("organization_id", organizationId),
    supabase.from("games").select("id", { count: "exact", head: true }).eq("organization_id", organizationId).eq("status", "final"),
    supabase.from("games").select("id", { count: "exact", head: true }).eq("organization_id", organizationId).eq("status", "scheduled"),
  ]);

  return {
    totalTeams:    teamsRes.count    ?? 0,
    gamesPlayed:   gamesRes.count    ?? 0,
    upcomingGames: upcomingRes.count ?? 0,
  };
}
