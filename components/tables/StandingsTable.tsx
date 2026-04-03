import { cn } from "@/lib/utils";
import type { StandingsRow } from "@/types";

interface StandingsTableProps {
  rows: StandingsRow[];
  highlightTeamId?: string;
}

export function StandingsTable({ rows, highlightTeamId }: StandingsTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[520px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <th className="sticky left-0 bg-muted w-8 px-4 py-3 text-center">#</th>
            <th className="sticky left-8 bg-muted px-3 py-3">Team</th>
            <th className="px-3 py-3 text-center">GP</th>
            <th className="px-3 py-3 text-center">W</th>
            <th className="px-3 py-3 text-center">L</th>
            <th className="px-3 py-3 text-center">PCT</th>
            <th className="px-3 py-3 text-center">RF</th>
            <th className="px-3 py-3 text-center">RA</th>
            <th className="px-3 py-3 text-center">DIFF</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isHighlighted = row.team_id === highlightTeamId;
            const gamesPlayed = row.wins + row.losses;
            const diff = row.runs_for - row.runs_against;
            const pct =
              gamesPlayed === 0
                ? "—"
                : row.win_pct.toFixed(3).replace(/^0/, "");

            return (
              <tr
                key={row.team_id}
                className={cn(
                  "border-b border-border last:border-0 transition-colors",
                  isHighlighted
                    ? "bg-[hsl(var(--primary)/0.08)] font-semibold"
                    : i % 2 === 0
                    ? "bg-card"
                    : "bg-muted/30"
                )}
              >
                <td className="sticky left-0 bg-inherit w-8 px-4 py-3 text-center text-muted-foreground tabular-nums">
                  {i + 1}
                </td>
                <td className="sticky left-8 bg-inherit px-3 py-3">
                  <span
                    className={cn(
                      isHighlighted && "text-[hsl(var(--primary))]"
                    )}
                  >
                    {row.team_name}
                  </span>
                </td>
                <td className="px-3 py-3 text-center tabular-nums text-muted-foreground">
                  {gamesPlayed}
                </td>
                <td className="px-3 py-3 text-center tabular-nums font-medium">
                  {row.wins}
                </td>
                <td className="px-3 py-3 text-center tabular-nums text-muted-foreground">
                  {row.losses}
                </td>
                <td className="px-3 py-3 text-center tabular-nums font-medium">
                  {pct}
                </td>
                <td className="px-3 py-3 text-center tabular-nums text-muted-foreground">
                  {row.runs_for}
                </td>
                <td className="px-3 py-3 text-center tabular-nums text-muted-foreground">
                  {row.runs_against}
                </td>
                <td
                  className={cn(
                    "px-3 py-3 text-center tabular-nums font-medium",
                    diff > 0
                      ? "text-emerald-600"
                      : diff < 0
                      ? "text-red-500"
                      : "text-muted-foreground"
                  )}
                >
                  {diff > 0 ? `+${diff}` : diff}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
