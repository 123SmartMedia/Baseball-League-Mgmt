import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const { data: comment } = await (supabase.from("board_comments") as any)
    .select("author_id")
    .eq("id", id)
    .single();

  const isAdmin = (profile as any)?.role === "admin";
  const isAuthor = comment?.author_id === user.id;

  if (!comment || (!isAdmin && !isAuthor)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await (supabase.from("board_comments") as any)
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
