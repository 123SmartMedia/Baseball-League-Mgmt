import { cn } from "@/lib/utils";
import type { GameStatus } from "@/types";

type BadgeVariant = GameStatus | "default";

const variantClasses: Record<BadgeVariant, string> = {
  scheduled: "bg-muted text-muted-foreground",
  live: "bg-green-100 text-green-800",
  final: "bg-foreground text-background",
  cancelled: "bg-red-100 text-red-800",
  default: "bg-muted text-muted-foreground",
};

const labels: Record<BadgeVariant, string> = {
  scheduled: "Scheduled",
  live: "Live",
  final: "Final",
  cancelled: "Cancelled",
  default: "–",
};

interface BadgeProps {
  variant?: BadgeVariant;
  label?: string;
  className?: string;
}

export function Badge({ variant = "default", label, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {label ?? labels[variant]}
    </span>
  );
}
