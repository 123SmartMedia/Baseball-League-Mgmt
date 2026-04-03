"use client";

import { useState } from "react";
import { FormModal } from "@/components/forms/FormModal";
import type { Rule } from "@/types";

const EVENT_TYPE_LABELS: Record<string, string> = {
  league: "League",
  tournament: "Tournament",
};

interface RulesClientProps {
  initialRules: Rule[];
  isAdmin: boolean;
}

type FilterEventType = "all" | "league" | "tournament";

interface RuleFormState {
  title: string;
  body: string;
  age_group: string;
  event_type: string;
  order_index: number;
}

const EMPTY_FORM: RuleFormState = {
  title: "",
  body: "",
  age_group: "",
  event_type: "",
  order_index: 0,
};

export function RulesClient({ initialRules, isAdmin }: RulesClientProps) {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [filter, setFilter] = useState<FilterEventType>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Rule | null>(null);
  const [form, setForm] = useState<RuleFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Rule | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, order_index: rules.length });
    setError(null);
    setModalOpen(true);
  }

  function openEdit(rule: Rule) {
    setEditing(rule);
    setForm({
      title:       rule.title,
      body:        rule.body,
      age_group:   rule.age_group ?? "",
      event_type:  rule.event_type ?? "",
      order_index: rule.order_index,
    });
    setError(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setError(null);
  }

  async function handleSave() {
    if (!form.title.trim() || !form.body.trim()) {
      setError("Title and body are required.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const url    = editing ? `/api/rules/${editing.id}` : "/api/rules";
      const method = editing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to save rule."); return; }

      if (editing) {
        setRules((prev) => prev.map((r) => (r.id === editing.id ? data : r)));
      } else {
        setRules((prev) => [...prev, data]);
      }
      closeModal();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/rules/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) return;
      setRules((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      // ignore
    } finally {
      setDeleting(false);
    }
  }

  const displayed = rules
    .filter((r) => filter === "all" || r.event_type === filter || r.event_type === null)
    .sort((a, b) => a.order_index - b.order_index);

  return (
    <>
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        {/* Filter pills */}
        <div className="flex gap-2">
          {(["all", "league", "tournament"] as FilterEventType[]).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === t
                  ? "bg-[hsl(var(--primary))] text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {t === "all" ? "All" : EVENT_TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {isAdmin && (
          <button
            onClick={openCreate}
            className="rounded-xl bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
          >
            + Add Rule
          </button>
        )}
      </div>

      {/* Rules list */}
      {displayed.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card py-16 text-center text-muted-foreground">
          {filter === "all" ? "No rules posted yet." : `No ${filter} rules yet.`}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {displayed.map((rule) => (
            <div
              key={rule.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{rule.title}</p>
                  {rule.age_group && (
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {rule.age_group}
                    </span>
                  )}
                  {rule.event_type && (
                    <span className="rounded-full bg-[hsl(var(--accent)/0.12)] px-2.5 py-0.5 text-xs font-medium text-[hsl(var(--accent))]">
                      {EVENT_TYPE_LABELS[rule.event_type]}
                    </span>
                  )}
                </div>
                {isAdmin && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEdit(rule)}
                      className="rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(rule)}
                      className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {rule.body}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <FormModal
        title={editing ? "Edit Rule" : "Add Rule"}
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSave}
        submitLabel={editing ? "Save Changes" : "Add Rule"}
        loading={loading}
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Title</label>
          <input
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))]"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Pitching limits"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Body</label>
          <textarea
            rows={5}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))] resize-none"
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            placeholder="Describe the rule in full..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Age Group</label>
            <input
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))]"
              value={form.age_group}
              onChange={(e) => setForm((f) => ({ ...f, age_group: e.target.value }))}
              placeholder="e.g. 10U (optional)"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Applies To</label>
            <select
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))]"
              value={form.event_type}
              onChange={(e) => setForm((f) => ({ ...f, event_type: e.target.value }))}
            >
              <option value="">All events</option>
              <option value="league">League only</option>
              <option value="tournament">Tournament only</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Order</label>
          <input
            type="number"
            min={0}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))]"
            value={form.order_index}
            onChange={(e) => setForm((f) => ({ ...f, order_index: Number(e.target.value) }))}
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </FormModal>

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
            <h3 className="mb-2">Delete Rule?</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{deleteTarget.title}</span> will be permanently removed.
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
