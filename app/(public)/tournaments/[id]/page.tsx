import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getTournament,
  getTournamentTeams,
  getTournamentGames,
  getTournamentStandings,
  getTournamentRules,
} from "@/lib/data/tournaments";
import { TournamentTabs, type TournamentTab } from "@/components/tournaments/TournamentTabs";
import { TournamentOverview } from "@/components/tournaments/TournamentOverview";
import { LeagueTeams }     from "@/components/leagues/LeagueTeams";
import { LeagueSchedule }  from "@/components/leagues/LeagueSchedule";
import { LeagueStandings } from "@/components/leagues/LeagueStandings";
import { LeagueRules }     from "@/components/leagues/LeagueRules";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: { id: string };
  searchParams: { tab?: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tournament = await getTournament(params.id);
  return { title: tournament?.name ?? "Tournament" };
}

const VALID_TABS: TournamentTab[] = ["overview", "teams", "schedule", "standings", "rules"];

function resolveTab(raw: string | undefined): TournamentTab {
  return VALID_TABS.includes(raw as TournamentTab) ? (raw as TournamentTab) : "overview";
}

export default async function TournamentDetailPage({ params, searchParams }: PageProps) {
  const activeTab = resolveTab(searchParams.tab);

  const tournament = await getTournament(params.id);
  if (!tournament) notFound();

  const [teams, games, standings, rules] = await Promise.all([
    activeTab === "teams"     || activeTab === "overview" ? getTournamentTeams(params.id)     : Promise.resolve([]),
    activeTab === "schedule"  || activeTab === "overview" ? getTournamentGames(params.id)     : Promise.resolve([]),
    activeTab === "standings" || activeTab === "overview" ? getTournamentStandings(params.id) : Promise.resolve([]),
    activeTab === "rules"                                 ? getTournamentRules(params.id)     : Promise.resolve([]),
  ]);

  const upcomingGames = games.filter((g) => g.status === "scheduled");

  return (
    <div className="container-app py-6 sm:py-10">
      {/* Header */}
      <div className="mb-6">
        <p className="mb-1 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {tournament.age_group} · Tournament
        </p>
        <h1 className="mb-1">{tournament.name}</h1>
        <p className="text-sm text-muted-foreground">
          {formatDate(tournament.start_date)} – {formatDate(tournament.end_date)}
          {tournament.location && ` · ${tournament.location}`}
        </p>
      </div>

      {/* Tab nav */}
      <TournamentTabs tournamentId={params.id} activeTab={activeTab} />

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <TournamentOverview
            tournament={tournament}
            upcomingGames={upcomingGames}
            standings={standings}
          />
        )}
        {activeTab === "teams"     && <LeagueTeams     teams={teams}    />}
        {activeTab === "schedule"  && <LeagueSchedule  games={games}    />}
        {activeTab === "standings" && <LeagueStandings rows={standings} />}
        {activeTab === "rules"     && <LeagueRules     rules={rules}    />}
      </div>
    </div>
  );
}
