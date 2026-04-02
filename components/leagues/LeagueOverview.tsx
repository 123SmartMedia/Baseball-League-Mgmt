import { formatDate } from "@/lib/utils";
import { GameCard } from "@/components/cards/GameCard";
import { StandingsTable } from "@/components/tables/StandingsTable";
import type { League, Game, StandingsRow } from "@/types";

interface LeagueOverviewProps {
  league: League;
  upcomingGames: Game[];
  standings: StandingsRow[];
}

export function LeagueOverview({ league, upcomingGames, standings }: LeagueOverviewProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Info */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Season" value={league.season} />
        <Stat label="Age Group" value={league.age_group} />
        <Stat label="Dates" value={`${formatDate(league.start_date)} – ${formatDate(league.end_date)}`} />
      </div>

      {league.description && (
        <p className="text-muted-foreground">{league.description}</p>
      )}

      {/* Upcoming games preview */}
      {upcomingGames.length > 0 && (
        <section>
          <h3 className="mb-4">Upcoming Games</h3>
          <div className="flex flex-col gap-3">
            {upcomingGames.slice(0, 3).map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* Standings preview */}
      {standings.length > 0 && (
        <section>
          <h3 className="mb-4">Standings</h3>
          <StandingsTable rows={standings} />
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-semibold">{value}</p>
    </div>
  );
}
