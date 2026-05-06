import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function getAdminProfile(supabase: Awaited<ReturnType<typeof createClient>>) {
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const profile = await getAdminProfile(supabase);
  if (!profile) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { name, age_group, description, start_date, end_date, location, entry_fee_cents } = body;

  const { data, error } = await (supabase.from("tournaments") as any)
    .update({
      name:            name?.trim(),
      age_group:       age_group?.trim(),
      description:     description?.trim() || null,
      start_date,
      end_date,
      location:        location?.trim() || null,
      entry_fee_cents: entry_fee_cents !== undefined ? Number(entry_fee_cents) || null : undefined,
    })
    .eq("id", id)
    .eq("organization_id", profile.organization_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const profile = await getAdminProfile(supabase);
  if (!profile) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { error } = await (supabase.from("tournaments") as any)
    .delete()
    .eq("id", id)
    .eq("organization_id", profile.organization_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
