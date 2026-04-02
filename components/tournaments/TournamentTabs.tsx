"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export type TournamentTab = "overview" | "teams" | "schedule" | "standings" | "rules";

const TABS: { id: TournamentTab; label: string }[] = [
  { id: "overview",  label: "Overview"  },
  { id: "teams",     label: "Teams"     },
  { id: "schedule",  label: "Schedule"  },
  { id: "standings", label: "Standings" },
  { id: "rules",     label: "Rules"     },
];

interface TournamentTabsProps {
  tournamentId: string;
  activeTab: TournamentTab;
}

export function TournamentTabs({ tournamentId, activeTab }: TournamentTabsProps) {
  return (
    <div className="border-b border-border">
      <nav className="-mb-px flex gap-0 overflow-x-auto">
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <Link
              key={tab.id}
              href={`/tournaments/${tournamentId}?tab=${tab.id}`}
              className={cn(
                "flex-shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
