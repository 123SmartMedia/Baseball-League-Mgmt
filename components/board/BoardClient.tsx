"use client";

import { useState } from "react";
import Link from "next/link";
import { FormModal } from "@/components/forms/FormModal";
import { toast } from "@/lib/toast";
import type { BoardCategory, BoardThread } from "@/types";

interface BoardClientProps {
  categories: BoardCategory[];
  threads: BoardThread[];
  currentUserId: string;
  isAdmin: boolean;
}

interface ThreadFormState {
  category_id: string;
  title: string;
  body: string;
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

export function BoardClient({
  categories,
  threads: initialThreads,
  currentUserId,
  isAdmin,
}: BoardClientProps) {
  const [threads, setThreads] = useState<BoardThread[]>(initialThreads);
  const [selectedCat, setSelectedCat] = useState<string | "all">("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ThreadFormState>({
    category_id: categories[0]?.id ?? "",
    title: "",
    body: "",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<BoardThread | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openCreate() {
    setForm({ category_id: categories[0]?.id ?? "", title: "", body: "" });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim() || !form.body.trim() || !form.category_id) {
      setFormError("Category, title, and body are required.");
      return;
    }
    setFormError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/board/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error ?? "Failed to post thread."); return; }
      setThreads((prev) => [data, ...prev]);
      setModalOpen(false);
      toast.success("Thread posted!");
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/board/threads/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setThreads((prev) => prev.filter((t) => t.id !== deleteTarget.id));
        setDeleteTarget(null);
        toast.success("Thread deleted.");
      } else {
        toast.error("Failed to delete thread.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleTogglePin(thread: BoardThread) {
    const res = await fetch(`/api/board/threads/${thread.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !thread.pinned }),
    });
    if (res.ok) {
      const updated = await res.json();
      setThreads((prev) => prev.map((t) => (t.id === thread.id ? { ...t, pinned: updated.pinned } : t)));
    }
  }

  const displayed = threads
    .filter((t) => selectedCat === "all" || t.category_id === selectedCat)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  return (
    <>
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCat("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedCat === "all"
                ? "bg-[hsl(var(--primary))] text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCat === cat.id
                  ? "bg-[hsl(var(--primary))] text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <button
          onClick={openCreate}
          className="rounded-xl bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
        >
          + New Thread
        </button>
      </div>

      {/* Thread list */}
      {displayed.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card py-16 text-center text-muted-foreground">
          No threads yet. Start the conversation!
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {displayed.map((thread) => (
            <div
              key={thread.id}
              className="group relative rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-sm"
            >
              {thread.pinned && (
                <span className="mr-2 inline-block rounded-full bg-[hsl(var(--accent)/0.12)] px-2 py-0.5 text-xs font-medium text-[hsl(var(--accent))]">
                  Pinned
                </span>
              )}

              <Link
                href={`/board/${thread.id}`}
                className="block after:absolute after:inset-0"
              >
                <p className="font-semibold leading-snug">{thread.title}</p>
              </Link>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="rounded-full bg-muted px-2 py-0.5 font-medium">
                  {categoryMap[thread.category_id] ?? "General"}
                </span>
                <span>{thread.author?.full_name ?? "Unknown"}</span>
                <span>{formatRelative(thread.created_at)}</span>
              </div>

              {/* Admin / author actions */}
              {(isAdmin || thread.author_id === currentUserId) && (
                <div className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  {isAdmin && (
                    <button
                      onClick={() => handleTogglePin(thread)}
                      className="rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                    >
                      {thread.pinned ? "Unpin" : "Pin"}
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTarget(thread)}
                    className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* New Thread Modal */}
      <FormModal
        title="New Thread"
        open={modalOpen}
        onClose={() => { setModalOpen(false); setFormError(null); }}
        onSubmit={handleSave}
        submitLabel="Post Thread"
        loading={saving}
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Category</label>
          <select
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))]"
            value={form.category_id}
            onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Title</label>
          <input
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))]"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Thread title…"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Body</label>
          <textarea
            rows={5}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))] resize-none"
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            placeholder="What's on your mind?"
          />
        </div>

        {formError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}
      </FormModal>

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
            <h3 className="mb-2">Delete Thread?</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{deleteTarget.title}</span> and all its replies will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
