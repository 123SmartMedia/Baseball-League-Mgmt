"use client";

import { useState } from "react";
import Link from "next/link";
import { AssignCoachModal } from "@/components/users/AssignCoachModal";
import { winPct } from "@/lib/utils";
import type { Profile, Team } from "@/types";

interface TeamsClientProps {
  teams: Team[];
  coaches: Profile[];
  isAdmin: boolean;
  currentUserId: string;
}

interface TeamWithCoach extends Team {
  assignedCoach?: Profile | null;
}

export function TeamsClient({ teams, coaches, isAdmin, currentUserId }: TeamsClientProps) {
  const [teamList, setTeamList] = useState<TeamWithCoach[]>(
    teams.map((t) => ({
      ...t,
      assignedCoach: coaches.find((c) => c.id === t.coach_id) ?? null,
    }))
  );
  const [assigning, setAssigning] = useState<TeamWithCoach | null>(null);

  function handleAssigned(teamId: string, coach: Profile | null) {
    setTeamList((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? { ...t, coach_id: coach?.id ?? null, assignedCoach: coach }
          : t
      )
    );
  }

  if (teamList.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        {isAdmin ? (
          <p className="text-muted-foreground">No teams yet.</p>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <p className="font-semibold">You haven't been assigned to a team yet.</p>
            <p className="text-sm text-muted-foreground">
              Contact your league administrator to be assigned to your team.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {teamList.map((team) => (
          <div
            key={team.id}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            {/* Team info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{team.name}</p>
              <p className="text-sm text-muted-foreground">
                {team.wins}W – {team.losses}L · {winPct(team.wins, team.losses)}
              </p>
              {/* Coach assignment */}
              <p className="mt-1 text-sm">
                {team.assignedCoach ? (
                  <span className="text-muted-foreground">
                    Coach: <span className="font-medium text-foreground">{team.assignedCoach.full_name}</span>
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium">No coach assigned</span>
                )}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {isAdmin && (
                <button
                  onClick={() => setAssigning(team)}
                  className="tap-target rounded-xl border border-border px-3 py-2 text-sm font-medium transition-all hover:bg-muted"
                >
                  {team.assignedCoach ? "Reassign" : "Assign Coach"}
                </button>
              )}
              <Link
                href={`/teams/${team.id}/roster`}
                className="tap-target rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
              >
                Roster
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Assign Coach Modal */}
      {assigning && (
        <AssignCoachModal
          team={assigning}
          coaches={coaches}
          open={true}
          onClose={() => setAssigning(null)}
          onAssigned={handleAssigned}
        />
      )}
    </>
  );
}
