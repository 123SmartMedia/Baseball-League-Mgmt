import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { formatDate, formatTime } from "@/lib/utils";
import type { Game } from "@/types";

interface GameCardProps {
  game: Game;
  className?: string;
}

export function GameCard({ game, className }: GameCardProps) {
  const homeTeam = game.home_team?.name ?? "TBD";
  const awayTeam = game.away_team?.name ?? "TBD";

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-sm card-hover",
        className
      )}
    >
      {/* Header: date + field + status */}
      <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {formatDate(game.scheduled_at)} · {formatTime(game.scheduled_at)}
          {game.field && ` · ${game.field}`}
        </span>
        <Badge variant={game.status} />
      </div>

      {/* Teams + score */}
      <div className="flex flex-col gap-2">
        <TeamRow
          name={homeTeam}
          score={game.home_score}
          isWinner={
            game.status === "final" &&
            game.home_score !== null &&
            game.away_score !== null &&
            game.home_score > game.away_score
          }
        />
        <TeamRow
          name={awayTeam}
          score={game.away_score}
          isWinner={
            game.status === "final" &&
            game.home_score !== null &&
            game.away_score !== null &&
            game.away_score > game.home_score
          }
        />
      </div>
    </div>
  );
}

function TeamRow({
  name,
  score,
  isWinner,
}: {
  name: string;
  score: number | null;
  isWinner: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-base", isWinner && "font-semibold")}>{name}</span>
      {score !== null && (
        <span className={cn("text-lg tabular-nums", isWinner && "font-bold")}>
          {score}
        </span>
      )}
    </div>
  );
}
