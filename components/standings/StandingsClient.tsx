"use client";

import { useState } from "react";
import { StandingsTable } from "@/components/tables/StandingsTable";
import type { League, Tournament, StandingsRow } from "@/types";

interface StandingsClientProps {
  leagues: League[];
  tournaments: Tournament[];
  /** Pre-keyed: leagueId → rows, tournamentId → rows */
  standingsByLeague: Record<string, StandingsRow[]>;
  standingsByTournament: Record<string, StandingsRow[]>;
}

type EventKind = "league" | "tournament";

export function StandingsClient({
  leagues,
  tournaments,
  standingsByLeague,
  standingsByTournament,
}: StandingsClientProps) {
  const firstLeague = leagues[0] ?? null;
  const firstTournament = tournaments[0] ?? null;

  const defaultKind: EventKind = firstLeague ? "league" : "tournament";
  const defaultId = firstLeague?.id ?? firstTournament?.id ?? null;

  const [kind, setKind] = useState<EventKind>(defaultKind);
  const [selectedId, setSelectedId] = useState<string | null>(defaultId);

  const events = kind === "league" ? leagues : tournaments;
  const rows = selectedId
    ? kind === "league"
      ? (standingsByLeague[selectedId] ?? [])
      : (standingsByTournament[selectedId] ?? [])
    : [];

  const selectedName =
    kind === "league"
      ? leagues.find((l) => l.id === selectedId)?.name
      : tournaments.find((t) => t.id === selectedId)?.name;

  function switchKind(next: EventKind) {
    setKind(next);
    if (next === "league") {
      setSelectedId(firstLeague?.id ?? null);
    } else {
      setSelectedId(firstTournament?.id ?? null);
    }
  }

  if (leagues.length === 0 && tournaments.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card py-16 text-center text-muted-foreground">
        No leagues or tournaments found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Kind toggle */}
      <div className="flex flex-wrap items-center gap-3">
        {leagues.length > 0 && (
          <button
            onClick={() => switchKind("league")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              kind === "league"
                ? "bg-[hsl(var(--primary))] text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            Leagues
          </button>
        )}
        {tournaments.length > 0 && (
          <button
            onClick={() => switchKind("tournament")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              kind === "tournament"
                ? "bg-[hsl(var(--primary))] text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            Tournaments
          </button>
        )}

        {/* Event selector */}
        {events.length > 1 && (
          <select
            value={selectedId ?? ""}
            onChange={(e) => setSelectedId(e.target.value)}
            className="h-9 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))]"
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Selected event label */}
      {selectedName && (
        <div className="flex items-center justify-between">
          <p className="font-semibold">{selectedName}</p>
          <p className="text-sm text-muted-foreground">
            {rows.length} team{rows.length !== 1 ? "s" : ""} · Updated live
          </p>
        </div>
      )}

      {/* Table */}
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card py-16 text-center text-muted-foreground">
          No standings data yet — scores must be entered for standings to appear.
        </div>
      ) : (
        <StandingsTable rows={rows} />
      )}
    </div>
  );
}
