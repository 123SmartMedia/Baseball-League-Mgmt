import { createClient } from "@/lib/supabase/server";
import type { Game } from "@/types";

export async function getOrgGames(organizationId: string): Promise<Game[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("games")
    .select(`
      *,
      home_team:teams!games_home_team_id_fkey(id, name),
      away_team:teams!games_away_team_id_fkey(id, name)
    `)
    .eq("organization_id", organizationId)
    .order("scheduled_at", { ascending: true });
  return (data ?? []) as Game[];
}
