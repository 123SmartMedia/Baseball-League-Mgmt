"use client";

import { useState } from "react";
import { GameCard } from "@/components/cards/GameCard";
import { formatDate } from "@/lib/utils";
import type { Game } from "@/types";

interface ScheduleListProps {
  games: Game[];
}

/** Groups games by calendar date and renders collapsible day sections */
export function ScheduleList({ games }: ScheduleListProps) {
  const grouped = groupByDate(games);
  const dates = Object.keys(grouped).sort();

  return (
    <div className="flex flex-col gap-6">
      {dates.map((date) => (
        <DateSection key={date} date={date} games={grouped[date]} />
      ))}
      {dates.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">No games scheduled.</p>
      )}
    </div>
  );
}

function DateSection({ date, games }: { date: string; games: Game[] }) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="mb-3 flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {formatDate(date)}
        </span>
        <span className="text-xs text-muted-foreground">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="flex flex-col gap-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
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
