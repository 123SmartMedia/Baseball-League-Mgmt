import Link from "next/link";
import { GameCard } from "@/components/cards/GameCard";
import type { Game } from "@/types";

interface UpcomingGamesProps {
  games: Game[];
}

export function UpcomingGames({ games }: UpcomingGamesProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3>Upcoming Games</h3>
        <Link
          href="/schedule"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      {games.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No upcoming games scheduled.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </section>
  );
}
