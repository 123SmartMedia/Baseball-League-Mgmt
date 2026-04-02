import { cn, winPct } from "@/lib/utils";
import type { Team } from "@/types";

interface TeamCardProps {
  team: Team;
  onViewTeam?: (id: string) => void;
  className?: string;
}

export function TeamCard({ team, onViewTeam, className }: TeamCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-sm card-hover",
        className
      )}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold">{team.name}</h3>
          <p className="text-sm text-muted-foreground">
            {team.wins}W – {team.losses}L · {winPct(team.wins, team.losses)}
          </p>
        </div>
      </div>

      {onViewTeam && (
        <button
          onClick={() => onViewTeam(team.id)}
          className="tap-target mt-2 w-full rounded-xl border border-border py-2 text-sm font-medium transition-all duration-150 hover:bg-muted"
        >
          View Team
        </button>
      )}
    </div>
  );
}
