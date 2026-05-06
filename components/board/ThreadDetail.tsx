"use client";

import { useState } from "react";
import { toast } from "@/lib/toast";
import type { BoardThread, BoardComment } from "@/types";

interface ThreadDetailProps {
  thread: BoardThread;
  comments: BoardComment[];
  currentUserId: string;
  isAdmin: boolean;
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function ThreadDetail({
  thread,
  comments: initialComments,
  currentUserId,
  isAdmin,
}: ThreadDetailProps) {
  const [comments, setComments] = useState<BoardComment[]>(initialComments);
  const [replyBody, setReplyBody] = useState("");
  const [posting, setPosting] = useState(false);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyBody.trim()) return;
    setPosting(true);
    try {
      const res = await fetch("/api/board/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thread_id: thread.id, body: replyBody.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Failed to post reply."); return; }
      setComments((prev) => [...prev, data]);
      setReplyBody("");
      toast.success("Reply posted!");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setPosting(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    const res = await fetch(`/api/board/comments/${commentId}`, { method: "DELETE" });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Reply deleted.");
    } else {
      toast.error("Failed to delete reply.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Original post */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="mb-4 text-sm leading-relaxed whitespace-pre-wrap">{thread.body}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{thread.author?.full_name ?? "Unknown"}</span>
          <span>{formatRelative(thread.created_at)}</span>
        </div>
      </div>

      {/* Comments */}
      {comments.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-muted-foreground">
            {comments.length} {comments.length === 1 ? "reply" : "replies"}
          </p>
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="group relative rounded-2xl border border-border bg-card p-4"
            >
              <p className="mb-3 text-sm leading-relaxed whitespace-pre-wrap">{comment.body}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{comment.author?.full_name ?? "Unknown"}</span>
                <span>{formatRelative(comment.created_at)}</span>
              </div>
              {(isAdmin || comment.author_id === currentUserId) && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 opacity-0 hover:bg-red-50 transition-all group-hover:opacity-100"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reply form */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <form onSubmit={handleReply} className="flex flex-col gap-3">
          <label className="text-sm font-medium">Write a reply</label>
          <textarea
            rows={3}
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder="Add your reply…"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))] resize-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={posting || !replyBody.trim()}
              className="rounded-xl bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {posting ? "Posting…" : "Post Reply"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
