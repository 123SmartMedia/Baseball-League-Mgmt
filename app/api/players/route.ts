import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const { data, error } = await (supabase.from("players") as any)
    .insert({
      team_id:         body.team_id,
      organization_id: body.organization_id,
      first_name:      body.first_name.trim(),
      last_name:       body.last_name.trim(),
      dob:             body.dob,
      jersey_number:   body.jersey_number.trim(),
      parent_name:     body.parent_name?.trim()  || null,
      parent_email:    body.parent_email?.trim() || null,
      parent_phone:    body.parent_phone?.trim() || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
