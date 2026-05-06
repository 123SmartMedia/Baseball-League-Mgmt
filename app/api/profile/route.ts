import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { full_name, phone } = body;

  if (!full_name?.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const { data, error } = await (supabase.from("profiles") as any)
    .update({
      full_name: full_name.trim(),
      phone:     phone?.trim() || null,
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
