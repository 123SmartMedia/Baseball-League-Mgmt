import type { Metadata } from "next";
import Link from "next/link";
import { getAllTournaments } from "@/lib/data/tournaments";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Tournament } from "@/types";

export const metadata: Metadata = { title: "Tournaments" };

export default async function TournamentsPage() {
  const tournaments = await getAllTournaments();

  return (
    <div className="container-app py-10">
      <h1 className="mb-8">Tournaments</h1>

      {tournaments.length === 0 ? (
        <p className="text-muted-foreground">No tournaments available yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function TournamentCard({ tournament }: { tournament: Tournament }) {
  const isUpcoming = new Date(tournament.start_date) > new Date();
  const isActive =
    new Date(tournament.start_date) <= new Date() &&
    new Date(tournament.end_date) >= new Date();

  return (
    <Link href={`/tournaments/${tournament.id}`} className="group block">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm card-hover">
        {/* Badges */}
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {tournament.age_group}
          </span>
          {isActive && (
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
              Active
            </span>
          )}
          {isUpcoming && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              Upcoming
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="mb-1 text-base font-semibold group-hover:text-primary transition-colors">
          {tournament.name}
        </h3>

        {/* Dates + location */}
        <p className="text-sm text-muted-foreground">
          {formatDate(tournament.start_date)} – {formatDate(tournament.end_date)}
        </p>
        {tournament.location && (
          <p className="mt-0.5 text-sm text-muted-foreground">{tournament.location}</p>
        )}

        {/* Entry fee */}
        {tournament.entry_fee_cents != null && (
          <p className="mt-3 text-sm font-semibold text-primary">
            {formatCurrency(tournament.entry_fee_cents)} entry
          </p>
        )}
      </div>
    </Link>
  );
}
