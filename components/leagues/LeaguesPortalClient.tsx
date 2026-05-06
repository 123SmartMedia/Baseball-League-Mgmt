"use client";

import { useState } from "react";
import { FormModal } from "@/components/forms/FormModal";
import { toast } from "@/lib/toast";
import type { League } from "@/types";

interface LeaguesPortalClientProps {
  initialLeagues: League[];
}

interface LeagueForm {
  name: string;
  age_group: string;
  season: string;
  description: string;
  start_date: string;
  end_date: string;
}

const EMPTY_FORM: LeagueForm = {
  name: "", age_group: "", season: "", description: "", start_date: "", end_date: "",
};

function leagueToForm(l: League): LeagueForm {
  return {
    name:        l.name,
    age_group:   l.age_group,
    season:      l.season,
    description: l.description ?? "",
    start_date:  l.start_date,
    end_date:    l.end_date,
  };
}

export function LeaguesPortalClient({ initialLeagues }: LeaguesPortalClientProps) {
  const [leagues, setLeagues] = useState<League[]>(initialLeagues);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<League | null>(null);
  const [form, setForm] = useState<LeagueForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<League | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(league: League) {
    setEditing(league);
    setForm(leagueToForm(league));
    setFormError(null);
    setModalOpen(true);
  }

  function closeModal() { setModalOpen(false); setEditing(null); setFormError(null); }

  function field(key: keyof LeagueForm) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value })),
    };
  }

  const inputCls = "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))]";

  async function handleSave() {
    if (!form.name.trim() || !form.age_group.trim() || !form.season.trim() || !form.start_date || !form.end_date) {
      setFormError("Name, age group, season, start date, and end date are required.");
      return;
    }
    setFormError(null);
    setSaving(true);
    try {
      const url    = editing ? `/api/leagues/${editing.id}` : "/api/leagues";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error ?? "Failed to save league."); return; }

      if (editing) {
        setLeagues((prev) => prev.map((l) => (l.id === editing.id ? data : l)));
        toast.success("League updated.");
      } else {
        setLeagues((prev) => [...prev, data]);
        toast.success("League created.");
      }
      closeModal();
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
      const res = await fetch(`/api/leagues/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setLeagues((prev) => prev.filter((l) => l.id !== deleteTarget.id));
        setDeleteTarget(null);
        toast.success("League deleted.");
      } else {
        const data = await res.json();
        toast.error(data.error ?? "Failed to delete league.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {/* Toolbar */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={openCreate}
          className="rounded-xl bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          + Add League
        </button>
      </div>

      {leagues.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card py-16 text-center text-muted-foreground">
          No leagues yet. Create your first league.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {leagues.map((league) => (
            <div key={league.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{league.name}</p>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-0.5">{league.age_group}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5">{league.season}</span>
                    <span>{league.start_date} → {league.end_date}</span>
                  </div>
                  {league.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{league.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(league)}
                    className="rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(league)}
                    className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <FormModal
        title={editing ? "Edit League" : "New League"}
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSave}
        submitLabel={editing ? "Save Changes" : "Create League"}
        loading={saving}
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Name</label>
          <input className={inputCls} {...field("name")} placeholder="e.g. Spring Rec League" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Age Group</label>
            <input className={inputCls} {...field("age_group")} placeholder="e.g. 10U" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Season</label>
            <input className={inputCls} {...field("season")} placeholder="e.g. Spring 2025" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Start Date</label>
            <input type="date" className={inputCls} {...field("start_date")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">End Date</label>
            <input type="date" className={inputCls} {...field("end_date")} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Description <span className="font-normal text-muted-foreground">(optional)</span></label>
          <textarea
            rows={3}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))] resize-none"
            {...field("description")}
            placeholder="Brief description of this league…"
          />
        </div>
        {formError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>
        )}
      </FormModal>

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
            <h3 className="mb-2">Delete League?</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{deleteTarget.name}</span> and all its data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-60">
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
