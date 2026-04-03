"use client";

import { useState } from "react";
import { FormModal } from "@/components/forms/FormModal";
import type { Game, Team, League, Tournament } from "@/types";

interface GameFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (game: Game) => void;
  teams: Team[];
  leagues: League[];
  tournaments: Tournament[];
  editing?: Game | null;
}

interface FormState {
  home_team_id: string;
  away_team_id: string;
  date: string;
  time: string;
  field: string;
  league_id: string;
  tournament_id: string;
}

function toLocalDateTimeparts(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const date = d.toISOString().slice(0, 10);
  const time = d.toTimeString().slice(0, 5);
  return { date, time };
}

function buildScheduledAt(date: string, time: string): string {
  return `${date}T${time || "00:00"}:00`;
}

export function GameFormModal({
  open,
  onClose,
  onSaved,
  teams,
  leagues,
  tournaments,
  editing,
}: GameFormModalProps) {
  const initial: FormState = editing
    ? (() => {
        const { date, time } = toLocalDateTimeparts(editing.scheduled_at);
        return {
          home_team_id:  editing.home_team_id,
          away_team_id:  editing.away_team_id,
          date,
          time,
          field:         editing.field ?? "",
          league_id:     editing.league_id ?? "",
          tournament_id: editing.tournament_id ?? "",
        };
      })()
    : {
        home_team_id:  "",
        away_team_id:  "",
        date:          "",
        time:          "10:00",
        field:         "",
        league_id:     leagues[0]?.id ?? "",
        tournament_id: "",
      };

  const [form, setForm] = useState<FormState>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!form.home_team_id || !form.away_team_id) {
      setError("Both home and away teams are required.");
      return;
    }
    if (form.home_team_id === form.away_team_id) {
      setError("Home and away teams must be different.");
      return;
    }
    if (!form.date) {
      setError("Date is required.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const payload = {
        home_team_id:  form.home_team_id,
        away_team_id:  form.away_team_id,
        scheduled_at:  buildScheduledAt(form.date, form.time),
        field:         form.field || null,
        league_id:     form.league_id || null,
        tournament_id: form.tournament_id || null,
      };

      const url    = editing ? `/api/games/${editing.id}` : "/api/games";
      const method = editing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to save game."); return; }

      onSaved(data);
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormModal
      title={editing ? "Edit Game" : "Add Game"}
      open={open}
      onClose={onClose}
      onSubmit={handleSave}
      submitLabel={editing ? "Save Changes" : "Add Game"}
      loading={loading}
    >
      {/* Teams */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Home Team</label>
          <select
            value={form.home_team_id}
            onChange={(e) => set("home_team_id", e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))]"
          >
            <option value="">Select team…</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Away Team</label>
          <select
            value={form.away_team_id}
            onChange={(e) => set("away_team_id", e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))]"
          >
            <option value="">Select team…</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Date / Time */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))]"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Time</label>
          <input
            type="time"
            value={form.time}
            onChange={(e) => set("time", e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))]"
          />
        </div>
      </div>

      {/* Field */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Field <span className="text-muted-foreground font-normal">(optional)</span></label>
        <input
          type="text"
          value={form.field}
          onChange={(e) => set("field", e.target.value)}
          placeholder="e.g. Field 3 — Riverside Park"
          className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))]"
        />
      </div>

      {/* League / Tournament */}
      {leagues.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">League <span className="text-muted-foreground font-normal">(optional)</span></label>
          <select
            value={form.league_id}
            onChange={(e) => { set("league_id", e.target.value); if (e.target.value) set("tournament_id", ""); }}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))]"
          >
            <option value="">— None —</option>
            {leagues.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      )}

      {tournaments.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Tournament <span className="text-muted-foreground font-normal">(optional)</span></label>
          <select
            value={form.tournament_id}
            onChange={(e) => { set("tournament_id", e.target.value); if (e.target.value) set("league_id", ""); }}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))]"
          >
            <option value="">— None —</option>
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </FormModal>
  );
}
