"use client";

import { useState } from "react";
import { FormModal } from "@/components/forms/FormModal";
import { toast } from "@/lib/toast";
import type { Tournament } from "@/types";

interface TournamentsPortalClientProps {
  initialTournaments: Tournament[];
}

interface TournamentForm {
  name: string;
  age_group: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  entry_fee_dollars: string;
}

const EMPTY_FORM: TournamentForm = {
  name: "", age_group: "", description: "",
  start_date: "", end_date: "", location: "", entry_fee_dollars: "",
};

function tournamentToForm(t: Tournament): TournamentForm {
  return {
    name:               t.name,
    age_group:          t.age_group,
    description:        t.description ?? "",
    start_date:         t.start_date,
    end_date:           t.end_date,
    location:           t.location ?? "",
    entry_fee_dollars:  t.entry_fee_cents != null ? String(t.entry_fee_cents / 100) : "",
  };
}

export function TournamentsPortalClient({ initialTournaments }: TournamentsPortalClientProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>(initialTournaments);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Tournament | null>(null);
  const [form, setForm] = useState<TournamentForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Tournament | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openCreate() { setEditing(null); setForm(EMPTY_FORM); setFormError(null); setModalOpen(true); }
  function openEdit(t: Tournament) { setEditing(t); setForm(tournamentToForm(t)); setFormError(null); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditing(null); setFormError(null); }

  function field(key: keyof TournamentForm) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value })),
    };
  }

  const inputCls = "h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))]";

  async function handleSave() {
    if (!form.name.trim() || !form.age_group.trim() || !form.start_date || !form.end_date) {
      setFormError("Name, age group, start date, and end date are required.");
      return;
    }
    setFormError(null);
    setSaving(true);
    try {
      const feeCents = form.entry_fee_dollars ? Math.round(parseFloat(form.entry_fee_dollars) * 100) : null;
      const payload = {
        name:            form.name,
        age_group:       form.age_group,
        description:     form.description || null,
        start_date:      form.start_date,
        end_date:        form.end_date,
        location:        form.location || null,
        entry_fee_cents: feeCents,
      };

      const url    = editing ? `/api/tournaments/${editing.id}` : "/api/tournaments";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error ?? "Failed to save tournament."); return; }

      if (editing) {
        setTournaments((prev) => prev.map((t) => (t.id === editing.id ? data : t)));
        toast.success("Tournament updated.");
      } else {
        setTournaments((prev) => [...prev, data]);
        toast.success("Tournament created.");
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
      const res = await fetch(`/api/tournaments/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setTournaments((prev) => prev.filter((t) => t.id !== deleteTarget.id));
        setDeleteTarget(null);
        toast.success("Tournament deleted.");
      } else {
        const data = await res.json();
        toast.error(data.error ?? "Failed to delete tournament.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button
          onClick={openCreate}
          className="rounded-xl bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          + Add Tournament
        </button>
      </div>

      {tournaments.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card py-16 text-center text-muted-foreground">
          No tournaments yet. Create your first tournament.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tournaments.map((t) => (
            <div key={t.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-0.5">{t.age_group}</span>
                    {t.location && <span className="rounded-full bg-muted px-2 py-0.5">{t.location}</span>}
                    {t.entry_fee_cents != null && (
                      <span className="rounded-full bg-muted px-2 py-0.5">${(t.entry_fee_cents / 100).toFixed(2)} entry</span>
                    )}
                    <span>{t.start_date} → {t.end_date}</span>
                  </div>
                  {t.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{t.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(t)} className="rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">Edit</button>
                  <button onClick={() => setDeleteTarget(t)} className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <FormModal
        title={editing ? "Edit Tournament" : "New Tournament"}
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSave}
        submitLabel={editing ? "Save Changes" : "Create Tournament"}
        loading={saving}
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Name</label>
          <input className={inputCls} {...field("name")} placeholder="e.g. Summer Invitational" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Age Group</label>
            <input className={inputCls} {...field("age_group")} placeholder="e.g. 12U" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Location</label>
            <input className={inputCls} {...field("location")} placeholder="e.g. Riverside Park (optional)" />
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
          <label className="text-sm font-medium">Entry Fee <span className="font-normal text-muted-foreground">(USD, optional)</span></label>
          <input type="number" min="0" step="0.01" className={inputCls} {...field("entry_fee_dollars")} placeholder="e.g. 150.00" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Description <span className="font-normal text-muted-foreground">(optional)</span></label>
          <textarea
            rows={3}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))] resize-none"
            {...field("description")}
            placeholder="Brief description…"
          />
        </div>
        {formError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>
        )}
      </FormModal>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
            <h3 className="mb-2">Delete Tournament?</h3>
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
