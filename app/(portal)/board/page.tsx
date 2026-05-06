import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/data/dashboard";
import { createClient } from "@/lib/supabase/server";
import { BoardClient } from "@/components/board/BoardClient";
import type { BoardCategory, BoardThread } from "@/types";

export const metadata: Metadata = { title: "Message Board" };

export default async function BoardPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const supabase = await createClient();

  const [categoriesRes, threadsRes] = await Promise.all([
    (supabase.from("board_categories") as any)
      .select("*")
      .eq("organization_id", profile.organization_id)
      .order("order_index", { ascending: true }),
    (supabase.from("board_threads") as any)
      .select(`*, author:profiles!board_threads_author_id_fkey(full_name)`)
      .eq("organization_id", profile.organization_id)
      .order("created_at", { ascending: false }),
  ]);

  const categories = (categoriesRes.data ?? []) as BoardCategory[];
  const threads = (threadsRes.data ?? []) as BoardThread[];

  return (
    <div>
      <div className="mb-6">
        <h2>Message Board</h2>
        <p className="text-sm text-muted-foreground">
          {threads.length} thread{threads.length !== 1 ? "s" : ""}
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card py-16 text-center text-muted-foreground">
          No board categories set up yet.
          {profile.role === "admin" && (
            <p className="mt-2 text-xs">Add categories from the Supabase dashboard to get started.</p>
          )}
        </div>
      ) : (
        <BoardClient
          categories={categories}
          threads={threads}
          currentUserId={profile.id}
          isAdmin={profile.role === "admin"}
        />
      )}
    </div>
  );
}
