import { formatDate, formatCurrency } from "@/lib/utils";
import { GameCard } from "@/components/cards/GameCard";
import { StandingsTable } from "@/components/tables/StandingsTable";
import type { Tournament, Game, StandingsRow } from "@/types";

interface TournamentOverviewProps {
  tournament: Tournament;
  upcomingGames: Game[];
  standings: StandingsRow[];
}

export function TournamentOverview({
  tournament,
  upcomingGames,
  standings,
}: TournamentOverviewProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Age Group" value={tournament.age_group} />
        <Stat
          label="Dates"
          value={`${formatDate(tournament.start_date)} – ${formatDate(tournament.end_date)}`}
        />
        {tournament.location && (
          <Stat label="Location" value={tournament.location} />
        )}
        {tournament.entry_fee_cents != null && (
          <Stat label="Entry Fee" value={formatCurrency(tournament.entry_fee_cents)} />
        )}
      </div>

      {tournament.description && (
        <p className="text-muted-foreground">{tournament.description}</p>
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
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold">{value}</p>
    </div>
  );
}
