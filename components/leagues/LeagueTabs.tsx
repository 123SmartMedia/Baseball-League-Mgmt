"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export type LeagueTab = "overview" | "teams" | "schedule" | "standings" | "rules";

const TABS: { id: LeagueTab; label: string }[] = [
  { id: "overview",  label: "Overview"  },
  { id: "teams",     label: "Teams"     },
  { id: "schedule",  label: "Schedule"  },
  { id: "standings", label: "Standings" },
  { id: "rules",     label: "Rules"     },
];

interface LeagueTabsProps {
  leagueId: string;
  activeTab: LeagueTab;
}

export function LeagueTabs({ leagueId, activeTab }: LeagueTabsProps) {
  return (
    <div className="border-b border-border">
      {/* Horizontally scrollable on mobile */}
      <nav className="-mb-px flex gap-0 overflow-x-auto">
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <Link
              key={tab.id}
              href={`/leagues/${leagueId}?tab=${tab.id}`}
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
