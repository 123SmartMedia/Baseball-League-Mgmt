import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getLeague,
  getLeagueTeams,
  getLeagueGames,
  getLeagueStandings,
  getLeagueRules,
} from "@/lib/data/leagues";
import { LeagueTabs, type LeagueTab } from "@/components/leagues/LeagueTabs";
import { LeagueOverview }  from "@/components/leagues/LeagueOverview";
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
  const league = await getLeague(params.id);
  return { title: league?.name ?? "League" };
}

const VALID_TABS: LeagueTab[] = ["overview", "teams", "schedule", "standings", "rules"];

function resolveTab(raw: string | undefined): LeagueTab {
  return VALID_TABS.includes(raw as LeagueTab) ? (raw as LeagueTab) : "overview";
}

export default async function LeagueDetailPage({ params, searchParams }: PageProps) {
  const activeTab = resolveTab(searchParams.tab);

  // Fetch league first — 404 fast if not found
  const league = await getLeague(params.id);
  if (!league) notFound();

  // Fetch remaining data in parallel based on active tab
  // Always fetch what overview needs; fetch tab-specific data on demand
  const [teams, games, standings, rules] = await Promise.all([
    activeTab === "teams"     || activeTab === "overview" ? getLeagueTeams(params.id)     : Promise.resolve([]),
    activeTab === "schedule"  || activeTab === "overview" ? getLeagueGames(params.id)     : Promise.resolve([]),
    activeTab === "standings" || activeTab === "overview" ? getLeagueStandings(params.id) : Promise.resolve([]),
    activeTab === "rules"                                 ? getLeagueRules(params.id)     : Promise.resolve([]),
  ]);

  const upcomingGames = games.filter((g) => g.status === "scheduled");

  return (
    <div className="container-app py-6 sm:py-10">
      {/* Header */}
      <div className="mb-6">
        <p className="mb-1 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {league.age_group} · {league.season}
        </p>
        <h1 className="mb-1">{league.name}</h1>
        <p className="text-sm text-muted-foreground">
          {formatDate(league.start_date)} – {formatDate(league.end_date)}
        </p>
      </div>

      {/* Tab nav */}
      <LeagueTabs leagueId={params.id} activeTab={activeTab} />

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <LeagueOverview
            league={league}
            upcomingGames={upcomingGames}
            standings={standings}
          />
        )}
        {activeTab === "teams"     && <LeagueTeams     teams={teams}      />}
        {activeTab === "schedule"  && <LeagueSchedule  games={games}      />}
        {activeTab === "standings" && <LeagueStandings rows={standings}   />}
        {activeTab === "rules"     && <LeagueRules     rules={rules}      />}
      </div>
    </div>
  );
}
