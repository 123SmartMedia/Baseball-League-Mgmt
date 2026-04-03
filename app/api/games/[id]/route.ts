import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { GameStatus } from "@/types";

const VALID_STATUSES: GameStatus[] = ["scheduled", "live", "final", "cancelled"];

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, organization_id")
    .eq("id", user.id)
    .single();
  if (!profile || (profile as any).role !== "admin") return null;
  return profile as { role: string; organization_id: string };
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const profile = await requireAdmin(supabase);
  if (!profile) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { error } = await (supabase.from("games") as any)
    .delete()
    .eq("id", id)
    .eq("organization_id", profile.organization_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return new NextResponse(null, { status: 204 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Only admins can enter scores
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { home_score, away_score, status } = body;

  const update: Record<string, unknown> = {};

  // ── Schedule edits (from GameFormModal) ──
  if ("home_team_id"  in body) update.home_team_id  = body.home_team_id;
  if ("away_team_id"  in body) update.away_team_id  = body.away_team_id;
  if ("scheduled_at"  in body) update.scheduled_at  = body.scheduled_at;
  if ("field"         in body) update.field         = body.field ?? null;
  if ("league_id"     in body) update.league_id     = body.league_id ?? null;
  if ("tournament_id" in body) update.tournament_id = body.tournament_id ?? null;

  // ── Score edits (from ScoreEntryModal) ──
  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    if (status === "final" && (home_score == null || away_score == null)) {
      return NextResponse.json(
        { error: "Both scores are required to mark a game as final." },
        { status: 400 }
      );
    }
    if (home_score != null && (!Number.isInteger(home_score) || home_score < 0)) {
      return NextResponse.json({ error: "Invalid home score" }, { status: 400 });
    }
    if (away_score != null && (!Number.isInteger(away_score) || away_score < 0)) {
      return NextResponse.json({ error: "Invalid away score" }, { status: 400 });
    }
    update.status = status;
    if (home_score != null) update.home_score = home_score;
    if (away_score != null) update.away_score = away_score;
  }

  const { data, error } = await (supabase.from("games") as any)
    .update(update)
    .eq("id", id)
    .select(`
      *,
      home_team:teams!games_home_team_id_fkey(id, name),
      away_team:teams!games_away_team_id_fkey(id, name)
    `)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
