"use client";

import { useState } from "react";
import { FormModal } from "@/components/forms/FormModal";
import { Input } from "@/components/ui/Input";
import { formatDate, formatTime } from "@/lib/utils";
import type { Game, GameStatus } from "@/types";

interface ScoreEntryModalProps {
  game: Game;
  open: boolean;
  onClose: () => void;
  onSaved: (updated: Game) => void;
}

const STATUS_OPTIONS: { value: GameStatus; label: string }[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "live",      label: "Live"      },
  { value: "final",     label: "Final"     },
  { value: "cancelled", label: "Cancelled" },
];

export function ScoreEntryModal({ game, open, onClose, onSaved }: ScoreEntryModalProps) {
  const [homeScore, setHomeScore] = useState(game.home_score?.toString() ?? "");
  const [awayScore, setAwayScore] = useState(game.away_score?.toString() ?? "");
  const [status, setStatus]       = useState<GameStatus>(game.status);
  const [error, setError]         = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);

  const homeTeam = game.home_team?.name ?? "Home";
  const awayTeam = game.away_team?.name ?? "Away";

  async function handleSave() {
    setError(null);

    if (status === "final" && (homeScore === "" || awayScore === "")) {
      setError("Both scores are required to mark the game as final.");
      return;
    }

    setSaving(true);
    const res = await fetch(`/api/games/${game.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        home_score: homeScore !== "" ? parseInt(homeScore, 10) : null,
        away_score: awayScore !== "" ? parseInt(awayScore, 10) : null,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const { error: msg } = await res.json();
      setError(msg ?? "Failed to save game.");
      return;
    }

    const updated: Game = await res.json();
    onSaved(updated);
    onClose();
  }

  return (
    <FormModal
      title="Enter Score"
      open={open}
      onClose={onClose}
      onSubmit={handleSave}
      submitLabel="Save"
      loading={saving}
    >
      {/* Game info */}
      <div className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
        {formatDate(game.scheduled_at)} · {formatTime(game.scheduled_at)}
        {game.field && ` · ${game.field}`}
      </div>

      {/* Score inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Home
          </p>
          <p className="font-semibold">{homeTeam}</p>
          <Input
            id="home_score"
            type="number"
            min="0"
            placeholder="0"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Away
          </p>
          <p className="font-semibold">{awayTeam}</p>
          <Input
            id="away_score"
            type="number"
            min="0"
            placeholder="0"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="status" className="text-sm font-medium">
          Game Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as GameStatus)}
          className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </FormModal>
  );
}
