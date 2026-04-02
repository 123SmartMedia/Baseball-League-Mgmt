import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/data/dashboard";
import { getOrgGames } from "@/lib/data/games";
import { ScheduleClient } from "@/components/games/ScheduleClient";

export const metadata: Metadata = { title: "Schedule" };

export default async function SchedulePage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const games = await getOrgGames(profile.organization_id);
  const isAdmin = profile.role === "admin";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2>Schedule</h2>
        <span className="text-sm text-muted-foreground">
          {games.length} game{games.length !== 1 ? "s" : ""}
        </span>
      </div>

      <ScheduleClient games={games} isAdmin={isAdmin} />
    </div>
  );
}
