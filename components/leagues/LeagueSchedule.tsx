import { ScheduleList } from "@/components/lists/ScheduleList";
import type { Game } from "@/types";

interface LeagueScheduleProps {
  games: Game[];
}

export function LeagueSchedule({ games }: LeagueScheduleProps) {
  if (games.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        No games scheduled yet.
      </div>
    );
  }

  return <ScheduleList games={games} />;
}
