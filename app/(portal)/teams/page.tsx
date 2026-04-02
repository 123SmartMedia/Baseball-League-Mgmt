import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/data/dashboard";
import { getOrgTeams } from "@/lib/data/teams";
import { winPct } from "@/lib/utils";
import type { Team } from "@/types";

export const metadata: Metadata = { title: "Teams" };

export default async function TeamsPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const teams = await getOrgTeams(profile.organization_id);
  const isAdmin = profile.role === "admin";

  // Coaches only see their own team
  const visible = isAdmin
    ? teams
    : teams.filter((t) => t.coach_id === profile.id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2>Teams</h2>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          No teams found.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((team) => (
            <TeamRow key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}

function TeamRow({ team }: { team: Team }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div>
        <p className="font-semibold">{team.name}</p>
        <p className="text-sm text-muted-foreground">
          {team.wins}W – {team.losses}L · {winPct(team.wins, team.losses)}
        </p>
      </div>
      <Link
        href={`/teams/${team.id}/roster`}
        className="tap-target rounded-xl border border-border px-4 py-2 text-sm font-medium transition-all hover:bg-muted"
      >
        Roster
      </Link>
    </div>
  );
}
