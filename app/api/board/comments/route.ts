import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { thread_id, body: commentBody } = body;

  if (!thread_id || !commentBody?.trim()) {
    return NextResponse.json({ error: "thread_id and body are required." }, { status: 400 });
  }

  const { data, error } = await (supabase.from("board_comments") as any)
    .insert({
      thread_id,
      author_id: user.id,
      body: commentBody.trim(),
    })
    .select(`*, author:profiles!board_comments_author_id_fkey(full_name)`)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
