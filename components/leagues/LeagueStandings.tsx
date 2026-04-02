import { StandingsTable } from "@/components/tables/StandingsTable";
import type { StandingsRow } from "@/types";

interface LeagueStandingsProps {
  rows: StandingsRow[];
}

export function LeagueStandings({ rows }: LeagueStandingsProps) {
  if (rows.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        No standings data yet.
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        {rows.length} team{rows.length !== 1 ? "s" : ""} · Updated live
      </p>
      <StandingsTable rows={rows} />
    </div>
  );
}
