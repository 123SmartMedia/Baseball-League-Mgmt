import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { League, Tournament } from "@/types";

export const metadata: Metadata = {
  title: "Youth Baseball League Management",
  description:
    "Find leagues, tournaments, teams, and schedules. The premier platform for youth baseball.",
};

async function getHomeData() {
  const supabase = await createClient();

  const [leaguesRes, tournamentsRes, teamsRes, playersRes] = await Promise.all([
    supabase.from("leagues").select("*").order("start_date", { ascending: false }),
    supabase.from("tournaments").select("*").order("start_date", { ascending: false }),
    supabase.from("teams").select("id", { count: "exact", head: true }),
    supabase.from("players").select("id", { count: "exact", head: true }),
  ]);

  return {
    leagues: (leaguesRes.data ?? []) as League[],
    tournaments: (tournamentsRes.data ?? []) as Tournament[],
    teamCount: teamsRes.count ?? 0,
    playerCount: playersRes.count ?? 0,
  };
}

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Roster Management",
    body: "Coaches can build and manage their roster online. Add players individually or bulk-upload via CSV. Parent contact info stays organized and accessible.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Live Standings",
    body: "Standings update automatically when game scores are entered. Win-loss records, winning percentage, and rankings — always current, no manual tracking.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Schedule & Scores",
    body: "Full game schedules published for parents and fans. Admins enter scores after each game and standings reflect the result instantly.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "Tournaments",
    body: "Run multi-day tournaments alongside your regular season. Separate brackets, schedules, and standings keep everything organized in one place.",
  },
];

export default async function HomePage() {
  const { leagues, tournaments, teamCount, playerCount } = await getHomeData();

  const upcomingLeagues = leagues.filter(
    (l) => new Date(l.end_date) >= new Date()
  ).slice(0, 3);

  const upcomingTournaments = tournaments.filter(
    (t) => new Date(t.end_date) >= new Date()
  ).slice(0, 3);

  const stats = [
    { label: "Active Leagues", value: leagues.length },
    { label: "Tournaments", value: tournaments.length },
    { label: "Teams", value: teamCount },
    { label: "Players", value: playerCount },
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[hsl(var(--primary))] text-white">
        {/* subtle diamond pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="container-app relative py-20 sm:py-28">
          <div className="max-w-2xl">
            <span className="mb-4 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
              Youth Baseball
            </span>
            <h1 className="mb-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl text-white">
              The Home of<br />
              Youth Baseball
            </h1>
            <p className="mb-8 text-lg text-white/80 sm:text-xl">
              Find leagues, tournaments, rosters, and live standings — all in one
              place. Built for coaches, designed for families.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/leagues"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[hsl(var(--primary))] shadow-sm transition-all hover:opacity-90"
              >
                Browse Leagues
              </Link>
              <Link
                href="/tournaments"
                className="rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/20"
              >
                View Tournaments
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-b border-border bg-card">
        <div className="container-app">
          <dl className="grid grid-cols-2 divide-x divide-border sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="px-4 py-6 text-center sm:px-8">
                <dt className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="mt-1 text-3xl font-bold tabular-nums text-foreground">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="container-app py-16 sm:py-20">
        <div className="mb-10 text-center">
          <h2 className="mb-3">Everything your league needs</h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            From first practice to championship game, our platform keeps coaches,
            parents, and administrators on the same page.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]">
                {f.icon}
              </div>
              <h3 className="mb-2 text-base font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Active Leagues ── */}
      {upcomingLeagues.length > 0 && (
        <section className="bg-muted/40 py-14 sm:py-20">
          <div className="container-app">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="mb-1">Active Leagues</h2>
                <p className="text-sm text-muted-foreground">
                  Current and upcoming seasons
                </p>
              </div>
              <Link
                href="/leagues"
                className="text-sm font-medium text-[hsl(var(--primary))] hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingLeagues.map((league) => (
                <Link
                  key={league.id}
                  href={`/leagues/${league.id}`}
                  className="group block"
                >
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm card-hover">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {league.age_group}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {league.season}
                      </span>
                    </div>
                    <h3 className="mb-1 text-base font-semibold group-hover:text-[hsl(var(--primary))] transition-colors">
                      {league.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(league.start_date)} – {formatDate(league.end_date)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Tournaments ── */}
      {upcomingTournaments.length > 0 && (
        <section className="py-14 sm:py-20">
          <div className="container-app">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="mb-1">Upcoming Tournaments</h2>
                <p className="text-sm text-muted-foreground">
                  Register your team before spots fill up
                </p>
              </div>
              <Link
                href="/tournaments"
                className="text-sm font-medium text-[hsl(var(--primary))] hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingTournaments.map((t) => {
                const entryFee = t.entry_fee_cents
                  ? `$${(t.entry_fee_cents / 100).toFixed(0)}`
                  : "Free";
                return (
                  <Link
                    key={t.id}
                    href={`/tournaments/${t.id}`}
                    className="group block"
                  >
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm card-hover">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="rounded-full bg-[hsl(var(--accent)/0.12)] px-2.5 py-0.5 text-xs font-medium text-[hsl(var(--accent))]">
                          {t.age_group}
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {entryFee}
                        </span>
                      </div>
                      <h3 className="mb-1 text-base font-semibold group-hover:text-[hsl(var(--primary))] transition-colors">
                        {t.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(t.start_date)} – {formatDate(t.end_date)}
                      </p>
                      {t.location && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5 flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {t.location}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Coach CTA ── */}
      <section className="border-t border-border bg-card py-14 sm:py-20">
        <div className="container-app text-center">
          <h2 className="mb-3">Are you a coach or league admin?</h2>
          <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
            Sign up to manage your roster, view your schedule, and track your
            team's performance — all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-xl bg-[hsl(var(--primary))] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90"
            >
              Sign Up as a Coach
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
