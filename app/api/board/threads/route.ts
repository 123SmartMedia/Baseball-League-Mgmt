import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { category_id, title, body: threadBody } = body;

  if (!category_id || !title?.trim() || !threadBody?.trim()) {
    return NextResponse.json({ error: "category_id, title, and body are required." }, { status: 400 });
  }

  const { data, error } = await (supabase.from("board_threads") as any)
    .insert({
      organization_id: (profile as any).organization_id,
      category_id,
      author_id: user.id,
      title: title.trim(),
      body: threadBody.trim(),
      pinned: false,
    })
    .select(`*, author:profiles!board_threads_author_id_fkey(full_name)`)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
