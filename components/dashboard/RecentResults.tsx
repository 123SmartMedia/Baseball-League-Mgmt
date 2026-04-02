import { GameCard } from "@/components/cards/GameCard";
import type { Game } from "@/types";

interface RecentResultsProps {
  games: Game[];
}

export function RecentResults({ games }: RecentResultsProps) {
  if (games.length === 0) return null;

  return (
    <section>
      <h3 className="mb-4">Recent Results</h3>
      <div className="flex flex-col gap-3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
