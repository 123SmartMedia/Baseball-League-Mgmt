import { TeamCard } from "@/components/cards/TeamCard";
import type { Team } from "@/types";

interface LeagueTeamsProps {
  teams: Team[];
}

export function LeagueTeams({ teams }: LeagueTeamsProps) {
  if (teams.length === 0) {
    return <EmptyState message="No teams registered yet." />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-16 text-center text-muted-foreground">{message}</div>
  );
}
