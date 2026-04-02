import { cn } from "@/lib/utils";
import type { Player } from "@/types";

interface PlayerCardProps {
  player: Player;
  showParentInfo?: boolean;
  onEdit?: (player: Player) => void;
  className?: string;
}

export function PlayerCard({
  player,
  showParentInfo = false,
  onEdit,
  className,
}: PlayerCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-4">
        {/* Jersey number bubble */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
          {player.jersey_number}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold">
            {player.first_name} {player.last_name}
          </p>
          <p className="text-sm text-muted-foreground">
            DOB: {new Date(player.dob).toLocaleDateString()}
          </p>
          {showParentInfo && player.parent_name && (
            <p className="mt-1 text-sm text-muted-foreground truncate">
              {player.parent_name} · {player.parent_phone ?? player.parent_email}
            </p>
          )}
        </div>

        {onEdit && (
          <button
            onClick={() => onEdit(player)}
            className="tap-target shrink-0 rounded-lg px-3 py-1 text-sm text-muted-foreground hover:bg-muted transition-all duration-150"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
