import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, organization_id")
    .eq("id", user.id)
    .single();

  if (!profile || (profile as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  if (!body.home_team_id || !body.away_team_id || !body.scheduled_at) {
    return NextResponse.json({ error: "home_team_id, away_team_id, and scheduled_at are required." }, { status: 400 });
  }

  if (body.home_team_id === body.away_team_id) {
    return NextResponse.json({ error: "Home and away teams must be different." }, { status: 400 });
  }

  const { data, error } = await (supabase.from("games") as any)
    .insert({
      organization_id: (profile as any).organization_id,
      home_team_id:    body.home_team_id,
      away_team_id:    body.away_team_id,
      scheduled_at:    body.scheduled_at,
      field:           body.field?.trim() || null,
      league_id:       body.league_id || null,
      tournament_id:   body.tournament_id || null,
      status:          "scheduled",
    })
    .select(`
      *,
      home_team:teams!games_home_team_id_fkey(id, name),
      away_team:teams!games_away_team_id_fkey(id, name)
    `)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
