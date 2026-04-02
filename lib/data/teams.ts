import { createClient } from "@/lib/supabase/server";
import type { Team, Player } from "@/types";

export async function getTeam(teamId: string): Promise<Team | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("teams")
    .select("*")
    .eq("id", teamId)
    .single();
  return data as Team | null;
}

export async function getOrgTeams(organizationId: string): Promise<Team[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("teams")
    .select("*")
    .eq("organization_id", organizationId)
    .order("name", { ascending: true });
  return (data ?? []) as Team[];
}

export async function getRoster(teamId: string): Promise<Player[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("players")
    .select("*")
    .eq("team_id", teamId)
    .order("jersey_number", { ascending: true });
  return (data ?? []) as Player[];
}
