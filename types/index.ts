// ─── Core domain types (mirrors Supabase schema) ───────────────────────────

export type UserRole = "admin" | "coach";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string | null;
  accent_color: string | null;
  domain: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  organization_id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

export type EventType = "league" | "tournament";
export type GameStatus = "scheduled" | "live" | "final" | "cancelled";

export interface League {
  id: string;
  organization_id: string;
  name: string;
  age_group: string;
  season: string;
  description: string | null;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface Tournament {
  id: string;
  organization_id: string;
  name: string;
  age_group: string;
  description: string | null;
  start_date: string;
  end_date: string;
  location: string | null;
  entry_fee_cents: number | null;
  created_at: string;
}

export interface Team {
  id: string;
  organization_id: string;
  league_id: string | null;
  tournament_id: string | null;
  name: string;
  coach_id: string | null;
  wins: number;
  losses: number;
  created_at: string;
}

export interface Player {
  id: string;
  team_id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  dob: string;
  jersey_number: string;
  parent_name: string | null;
  parent_email: string | null;
  parent_phone: string | null;
  created_at: string;
}

export interface Game {
  id: string;
  organization_id: string;
  league_id: string | null;
  tournament_id: string | null;
  home_team_id: string;
  away_team_id: string;
  scheduled_at: string;
  field: string | null;
  status: GameStatus;
  home_score: number | null;
  away_score: number | null;
  created_at: string;
  // Joined relations
  home_team?: Pick<Team, "id" | "name">;
  away_team?: Pick<Team, "id" | "name">;
}

export interface Rule {
  id: string;
  organization_id: string;
  title: string;
  body: string;
  age_group: string | null;
  event_type: EventType | null;
  order_index: number;
  created_at: string;
}

export interface BoardCategory {
  id: string;
  organization_id: string;
  name: string;
  order_index: number;
}

export interface BoardThread {
  id: string;
  category_id: string;
  organization_id: string;
  author_id: string;
  title: string;
  body: string;
  pinned: boolean;
  created_at: string;
  author?: Pick<Profile, "full_name">;
}

export interface BoardComment {
  id: string;
  thread_id: string;
  author_id: string;
  body: string;
  created_at: string;
  author?: Pick<Profile, "full_name">;
}

export interface StandingsRow {
  team_id: string;
  team_name: string;
  wins: number;
  losses: number;
  runs_for: number;
  runs_against: number;
  win_pct: number;
}
