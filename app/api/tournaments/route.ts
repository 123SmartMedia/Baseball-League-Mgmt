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
  const { name, age_group, description, start_date, end_date, location, entry_fee_cents } = body;

  if (!name?.trim() || !age_group?.trim() || !start_date || !end_date) {
    return NextResponse.json({ error: "Name, age group, start date, and end date are required." }, { status: 400 });
  }

  const { data, error } = await (supabase.from("tournaments") as any)
    .insert({
      organization_id:  (profile as any).organization_id,
      name:             name.trim(),
      age_group:        age_group.trim(),
      description:      description?.trim() || null,
      start_date,
      end_date,
      location:         location?.trim() || null,
      entry_fee_cents:  entry_fee_cents ? Number(entry_fee_cents) : null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
