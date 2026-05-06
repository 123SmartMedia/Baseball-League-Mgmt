import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getProfile } from "@/lib/data/dashboard";
import { createClient } from "@/lib/supabase/server";
import { ThreadDetail } from "@/components/board/ThreadDetail";
import type { BoardThread, BoardComment } from "@/types";

export const metadata: Metadata = { title: "Thread" };

interface PageProps {
  params: Promise<{ threadId: string }>;
}

export default async function ThreadPage({ params }: PageProps) {
  const { threadId } = await params;
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const supabase = await createClient();

  const [threadRes, commentsRes] = await Promise.all([
    (supabase.from("board_threads") as any)
      .select(`*, author:profiles!board_threads_author_id_fkey(full_name)`)
      .eq("id", threadId)
      .eq("organization_id", profile.organization_id)
      .single(),
    (supabase.from("board_comments") as any)
      .select(`*, author:profiles!board_comments_author_id_fkey(full_name)`)
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true }),
  ]);

  if (!threadRes.data) notFound();

  const thread = threadRes.data as BoardThread;
  const comments = (commentsRes.data ?? []) as BoardComment[];

  return (
    <div>
      {/* Back link */}
      <Link
        href="/board"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Message Board
      </Link>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {thread.pinned && (
            <span className="rounded-full bg-[hsl(var(--accent)/0.12)] px-2.5 py-0.5 text-xs font-medium text-[hsl(var(--accent))]">
              Pinned
            </span>
          )}
        </div>
        <h2 className="mt-2">{thread.title}</h2>
      </div>

      <ThreadDetail
        thread={thread}
        comments={comments}
        currentUserId={profile.id}
        isAdmin={profile.role === "admin"}
      />
    </div>
  );
}
