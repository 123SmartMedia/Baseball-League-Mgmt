import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/data/dashboard";
import { getOrgTeams } from "@/lib/data/teams";
import { createClient } from "@/lib/supabase/server";
import { TeamsClient } from "@/components/teams/TeamsClient";
import type { Profile, Team } from "@/types";

export const metadata: Metadata = { title: "Teams" };

export default async function TeamsPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const supabase = await createClient();
  const isAdmin = profile.role === "admin";

  // Fetch teams + coaches in parallel
  const [teams, coachesRes] = await Promise.all([
    getOrgTeams(profile.organization_id),
    isAdmin
      ? supabase
          .from("profiles")
          .select("*")
          .eq("organization_id", profile.organization_id)
          .eq("role", "coach")
          .order("full_name")
      : Promise.resolve({ data: [] }),
  ]);

  const coaches = ((coachesRes as any).data ?? []) as Profile[];

  // Coaches only see their own team
  const visible: Team[] = isAdmin
    ? teams
    : teams.filter((t) => t.coach_id === profile.id);

  return (
    <div>
      <div className="mb-6">
        <h2>Teams</h2>
        {isAdmin && (
          <p className="text-sm text-muted-foreground">
            {teams.length} team{teams.length !== 1 ? "s" : ""} · Click a team to manage roster or assign a coach.
          </p>
        )}
      </div>

      <TeamsClient
        teams={visible}
        coaches={coaches}
        isAdmin={isAdmin}
        currentUserId={profile.id}
      />
    </div>
  );
}
