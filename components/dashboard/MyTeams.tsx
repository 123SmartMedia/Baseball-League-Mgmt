import Link from "next/link";
import { TeamCard } from "@/components/cards/TeamCard";
import type { Team } from "@/types";

interface MyTeamsProps {
  teams: Team[];
  role: "admin" | "coach";
}

export function MyTeams({ teams, role }: MyTeamsProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3>{role === "admin" ? "All Teams" : "My Team"}</h3>
        <Link
          href="/teams"
          className="text-sm font-medium text-primary hover:underline"
        >
          {role === "admin" ? "Manage teams" : "View roster"}
        </Link>
      </div>

      {teams.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          {role === "coach" ? "You haven't been assigned to a team yet." : "No teams yet."}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onViewTeam={() => {}}
            />
          ))}
        </div>
      )}
    </section>
  );
}
