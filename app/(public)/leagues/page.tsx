import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { League } from "@/types";

export const metadata: Metadata = { title: "Leagues" };

async function getAllLeagues(): Promise<League[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leagues")
    .select("*")
    .order("start_date", { ascending: false });
  return (data ?? []) as League[];
}

export default async function LeaguesPage() {
  const leagues = await getAllLeagues();

  return (
    <div className="container-app py-10">
      <h1 className="mb-8">Leagues</h1>

      {leagues.length === 0 ? (
        <p className="text-muted-foreground">No leagues available yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leagues.map((league) => (
            <Link key={league.id} href={`/leagues/${league.id}`} className="group block">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm card-hover">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {league.age_group}
                  </span>
                  <span className="text-xs text-muted-foreground">{league.season}</span>
                </div>
                <h3 className="mb-1 text-base font-semibold group-hover:text-primary transition-colors">
                  {league.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(league.start_date)} – {formatDate(league.end_date)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
