"use client";

import { useState } from "react";
import { GameCard } from "@/components/cards/GameCard";
import { Badge } from "@/components/ui/Badge";
import { ScoreEntryModal } from "./ScoreEntryModal";
import { formatDate, formatTime, cn } from "@/lib/utils";
import type { Game, GameStatus } from "@/types";

interface ScheduleClientProps {
  games: Game[];
  isAdmin: boolean;
}

type Filter = "all" | "scheduled" | "live" | "final";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all",       label: "All"       },
  { value: "scheduled", label: "Upcoming"  },
  { value: "live",      label: "Live"      },
  { value: "final",     label: "Final"     },
];

export function ScheduleClient({ games: initialGames, isAdmin }: ScheduleClientProps) {
  const [games, setGames]       = useState<Game[]>(initialGames);
  const [filter, setFilter]     = useState<Filter>("all");
  const [selected, setSelected] = useState<Game | null>(null);

  const filtered = filter === "all"
    ? games
    : games.filter((g) => g.status === filter);

  const grouped = groupByDate(filtered);
  const dates = Object.keys(grouped).sort();

  function handleSaved(updated: Game) {
    setGames((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "flex-shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-150",
              filter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
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
                  <div key={game.id} className="flex items-stretch gap-3">
                    <div className="flex-1">
                      <GameCard game={game} />
                    </div>
                    {isAdmin && game.status !== "cancelled" && (
                      <button
                        onClick={() => setSelected(game)}
                        className={cn(
                          "flex-shrink-0 rounded-2xl border px-4 text-sm font-medium transition-all duration-150",
                          game.status === "live"
                            ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                            : game.status === "final"
                            ? "border-border bg-muted text-muted-foreground hover:bg-secondary"
                            : "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
                        )}
                      >
                        {game.status === "final" ? "Edit Score" : "Enter Score"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Score entry modal */}
      {selected && (
        <ScoreEntryModal
          game={selected}
          open={true}
          onClose={() => setSelected(null)}
          onSaved={handleSaved}
        />
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
