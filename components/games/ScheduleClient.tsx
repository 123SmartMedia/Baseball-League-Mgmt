"use client";

import { useState } from "react";
import { GameCard } from "@/components/cards/GameCard";
import { ScoreEntryModal } from "./ScoreEntryModal";
import { GameFormModal } from "./GameFormModal";
import { formatDate, cn } from "@/lib/utils";
import type { Game, GameStatus, Team, League, Tournament } from "@/types";

interface ScheduleClientProps {
  games: Game[];
  isAdmin: boolean;
  teams: Team[];
  leagues: League[];
  tournaments: Tournament[];
}

type Filter = "all" | "scheduled" | "live" | "final";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all",       label: "All"      },
  { value: "scheduled", label: "Upcoming" },
  { value: "live",      label: "Live"     },
  { value: "final",     label: "Final"    },
];

export function ScheduleClient({
  games: initialGames,
  isAdmin,
  teams,
  leagues,
  tournaments,
}: ScheduleClientProps) {
  const [games, setGames]         = useState<Game[]>(initialGames);
  const [filter, setFilter]       = useState<Filter>("all");
  const [scoring, setScoring]     = useState<Game | null>(null);
  const [editingGame, setEditing] = useState<Game | null>(null);
  const [addOpen, setAddOpen]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Game | null>(null);
  const [deleting, setDeleting]   = useState(false);

  const filtered = filter === "all" ? games : games.filter((g) => g.status === filter);
  const grouped  = groupByDate(filtered);
  const dates    = Object.keys(grouped).sort();

  function handleScoreSaved(updated: Game) {
    setGames((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
  }

  function handleGameSaved(saved: Game) {
    setGames((prev) => {
      const exists = prev.find((g) => g.id === saved.id);
      return exists
        ? prev.map((g) => (g.id === saved.id ? saved : g))
        : [...prev, saved].sort(
            (a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
          );
    });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/games/${deleteTarget.id}`, { method: "DELETE" });
      setGames((prev) => prev.filter((g) => g.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "flex-shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                filter === f.value
                  ? "bg-[hsl(var(--primary))] text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isAdmin && (
          <button
            onClick={() => setAddOpen(true)}
            className="rounded-xl bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
          >
            + Add Game
          </button>
        )}
      </div>

      {/* Games grouped by date */}
      {dates.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          No games found.
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {dates.map((date) => (
            <section key={date}>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {formatDate(date)}
              </p>
              <div className="flex flex-col gap-3">
                {grouped[date].map((game) => (
                  <div key={game.id} className="flex items-stretch gap-2">
                    <div className="flex-1">
                      <GameCard game={game} />
                    </div>

                    {isAdmin && game.status !== "cancelled" && (
                      <button
                        onClick={() => setScoring(game)}
                        className={cn(
                          "flex-shrink-0 rounded-2xl border px-3 text-sm font-medium transition-all",
                          game.status === "live"
                            ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                            : game.status === "final"
                            ? "border-border bg-muted text-muted-foreground hover:bg-secondary"
                            : "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
                        )}
                      >
                        {game.status === "final" ? "Edit Score" : "Score"}
                      </button>
                    )}

                    {isAdmin && (
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <button
                          onClick={() => { setEditing(game); }}
                          className="flex-1 rounded-xl border border-border px-3 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(game)}
                          className="flex-1 rounded-xl border border-red-200 px-3 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Del
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Score entry modal */}
      {scoring && (
        <ScoreEntryModal
          game={scoring}
          open={true}
          onClose={() => setScoring(null)}
          onSaved={handleScoreSaved}
        />
      )}

      {/* Add game modal */}
      {addOpen && (
        <GameFormModal
          open={true}
          onClose={() => setAddOpen(false)}
          onSaved={handleGameSaved}
          teams={teams}
          leagues={leagues}
          tournaments={tournaments}
        />
      )}

      {/* Edit game modal */}
      {editingGame && (
        <GameFormModal
          open={true}
          onClose={() => setEditing(null)}
          onSaved={(saved) => { handleGameSaved(saved); setEditing(null); }}
          teams={teams}
          leagues={leagues}
          tournaments={tournaments}
          editing={editingGame}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
            <h3 className="mb-2">Delete Game?</h3>
            <p className="mb-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {deleteTarget.home_team?.name} vs {deleteTarget.away_team?.name}
              </span>
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
              {formatDate(deleteTarget.scheduled_at)} — this cannot be undone.
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
    </div>
  );
}

function groupByDate(games: Game[]): Record<string, Game[]> {
  return games.reduce<Record<string, Game[]>>((acc, game) => {
    const date = game.scheduled_at.slice(0, 10);
    (acc[date] ??= []).push(game);
    return acc;
  }, {});
}
