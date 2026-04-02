import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTeam, getRoster } from "@/lib/data/teams";
import { getProfile } from "@/lib/data/dashboard";
import { RosterClient } from "@/components/roster/RosterClient";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const team = await getTeam(params.id);
  return { title: team ? `${team.name} – Roster` : "Roster" };
}

export default async function RosterPage({ params }: PageProps) {
  const [profile, team, players] = await Promise.all([
    getProfile(),
    getTeam(params.id),
    getRoster(params.id),
  ]);

  if (!profile) redirect("/login");
  if (!team) notFound();

  // Coaches can only view their own team's roster
  if (profile.role === "coach" && team.coach_id !== profile.id) {
    redirect("/dashboard");
  }

  const isAdmin = profile.role === "admin";

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className="mb-1 text-sm text-muted-foreground">Roster</p>
        <h2>{team.name}</h2>
        <p className="text-sm text-muted-foreground">
          {team.wins}W – {team.losses}L
        </p>
      </div>

      <RosterClient
        players={players}
        teamId={team.id}
        organizationId={team.organization_id}
        isAdmin={isAdmin}
      />
    </div>
  );
}
