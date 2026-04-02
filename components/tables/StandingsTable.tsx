import { cn } from "@/lib/utils";
import type { StandingsRow } from "@/types";

interface StandingsTableProps {
  rows: StandingsRow[];
  highlightTeamId?: string;
}

export function StandingsTable({ rows, highlightTeamId }: StandingsTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[420px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted text-left text-muted-foreground">
            <th className="sticky left-0 bg-muted px-4 py-3 font-medium">Team</th>
            <th className="px-3 py-3 text-center font-medium">W</th>
            <th className="px-3 py-3 text-center font-medium">L</th>
            <th className="px-3 py-3 text-center font-medium">PCT</th>
            <th className="px-3 py-3 text-center font-medium">RF</th>
            <th className="px-3 py-3 text-center font-medium">RA</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.team_id}
              className={cn(
                "border-b border-border last:border-0 transition-colors",
                row.team_id === highlightTeamId
                  ? "bg-primary/10 font-semibold"
                  : i % 2 === 0
                  ? "bg-card"
                  : "bg-muted/30"
              )}
            >
              <td className="sticky left-0 bg-inherit px-4 py-3">{row.team_name}</td>
              <td className="px-3 py-3 text-center tabular-nums">{row.wins}</td>
              <td className="px-3 py-3 text-center tabular-nums">{row.losses}</td>
              <td className="px-3 py-3 text-center tabular-nums">
                {row.win_pct.toFixed(3).replace(/^0/, "")}
              </td>
              <td className="px-3 py-3 text-center tabular-nums">{row.runs_for}</td>
              <td className="px-3 py-3 text-center tabular-nums">{row.runs_against}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
