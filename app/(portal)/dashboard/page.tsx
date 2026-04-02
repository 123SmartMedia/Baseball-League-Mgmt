import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  getProfile,
  getDashboardGames,
  getDashboardTeams,
  getDashboardStats,
} from "@/lib/data/dashboard";
import { StatCard }      from "@/components/dashboard/StatCard";
import { UpcomingGames } from "@/components/dashboard/UpcomingGames";
import { RecentResults } from "@/components/dashboard/RecentResults";
import { MyTeams }       from "@/components/dashboard/MyTeams";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const [{ upcoming, recent }, teams, stats] = await Promise.all([
    getDashboardGames(profile.organization_id, profile.id, profile.role),
    getDashboardTeams(profile.organization_id, profile.id, profile.role),
    getDashboardStats(profile.organization_id),
  ]);

  const isAdmin = profile.role === "admin";

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h2>{profile.full_name}</h2>
        <span className="mt-1 inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize text-muted-foreground">
          {profile.role}
        </span>
      </div>

      {/* Stats row — admin only */}
      {isAdmin && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StatCard label="Total Teams"    value={stats.totalTeams}    />
          <StatCard label="Games Played"   value={stats.gamesPlayed}   />
          <StatCard label="Games Scheduled" value={stats.upcomingGames} />
        </div>
      )}

      {/* Upcoming games */}
      <UpcomingGames games={upcoming} />

      {/* Recent results */}
      <RecentResults games={recent} />

      {/* Teams */}
      <MyTeams teams={teams} role={profile.role} />
    </div>
  );
}
