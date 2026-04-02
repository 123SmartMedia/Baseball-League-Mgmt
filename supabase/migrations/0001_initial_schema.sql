-- ============================================================
-- 0001_initial_schema.sql
-- Multi-tenant baseball league management platform
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ============================================================
-- ORGANIZATIONS  (one row per tenant / white-label client)
-- ============================================================
create table organizations (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  slug            text not null unique,          -- URL-safe identifier
  logo_url        text,
  primary_color   text,                          -- HSL string e.g. "220 90% 50%"
  accent_color    text,
  domain          text unique,                   -- custom domain if any
  created_at      timestamptz not null default now()
);

-- ============================================================
-- PROFILES  (extends auth.users, one per user)
-- ============================================================
create type user_role as enum ('admin', 'coach');

create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  role            user_role not null default 'coach',
  full_name       text not null,
  email           text not null,
  phone           text,
  created_at      timestamptz not null default now()
);

-- Auto-create a profile row when a new auth user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, organization_id, full_name, email)
  values (
    new.id,
    (new.raw_user_meta_data->>'organization_id')::uuid,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- LEAGUES
-- ============================================================
create table leagues (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name            text not null,
  age_group       text not null,                 -- e.g. "8U", "10U", "12U"
  season          text not null,                 -- e.g. "Spring 2025"
  description     text,
  start_date      date not null,
  end_date        date not null,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- TOURNAMENTS
-- ============================================================
create table tournaments (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name            text not null,
  age_group       text not null,
  description     text,
  start_date      date not null,
  end_date        date not null,
  location        text,
  entry_fee_cents integer check (entry_fee_cents >= 0),
  created_at      timestamptz not null default now()
);

-- ============================================================
-- TEAMS
-- ============================================================
create table teams (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  league_id       uuid references leagues(id) on delete set null,
  tournament_id   uuid references tournaments(id) on delete set null,
  name            text not null,
  coach_id        uuid references profiles(id) on delete set null,
  wins            integer not null default 0 check (wins >= 0),
  losses          integer not null default 0 check (losses >= 0),
  created_at      timestamptz not null default now(),
  constraint team_in_one_event check (
    (league_id is not null)::int + (tournament_id is not null)::int <= 1
  )
);

-- ============================================================
-- PLAYERS
-- ============================================================
create table players (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  team_id         uuid not null references teams(id) on delete cascade,
  first_name      text not null,
  last_name       text not null,
  dob             date not null,
  jersey_number   text not null,
  parent_name     text,
  parent_email    text,
  parent_phone    text,
  created_at      timestamptz not null default now(),
  constraint unique_jersey_per_team unique (team_id, jersey_number)
);

-- ============================================================
-- GAMES
-- ============================================================
create type game_status as enum ('scheduled', 'live', 'final', 'cancelled');

create table games (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  league_id       uuid references leagues(id) on delete cascade,
  tournament_id   uuid references tournaments(id) on delete cascade,
  home_team_id    uuid not null references teams(id) on delete cascade,
  away_team_id    uuid not null references teams(id) on delete cascade,
  scheduled_at    timestamptz not null,
  field           text,
  status          game_status not null default 'scheduled',
  home_score      integer check (home_score >= 0),
  away_score      integer check (away_score >= 0),
  created_at      timestamptz not null default now(),
  constraint game_in_one_event check (
    (league_id is not null)::int + (tournament_id is not null)::int <= 1
  ),
  constraint different_teams check (home_team_id <> away_team_id)
);

-- Auto-update team W/L when a game is marked final
create or replace function update_team_record()
returns trigger language plpgsql security definer as $$
begin
  -- Only act when status changes to 'final'
  if new.status = 'final' and (old.status is distinct from 'final') then
    if new.home_score > new.away_score then
      update teams set wins = wins + 1   where id = new.home_team_id;
      update teams set losses = losses + 1 where id = new.away_team_id;
    elsif new.away_score > new.home_score then
      update teams set wins = wins + 1   where id = new.away_team_id;
      update teams set losses = losses + 1 where id = new.home_team_id;
    end if;
  end if;
  -- Reverse if a final game is re-opened
  if old.status = 'final' and new.status <> 'final' then
    if old.home_score > old.away_score then
      update teams set wins = wins - 1   where id = new.home_team_id;
      update teams set losses = losses - 1 where id = new.away_team_id;
    elsif old.away_score > old.home_score then
      update teams set wins = wins - 1   where id = new.away_team_id;
      update teams set losses = losses - 1 where id = new.home_team_id;
    end if;
  end if;
  return new;
end;
$$;

create trigger on_game_status_change
  after update on games
  for each row execute procedure update_team_record();

-- ============================================================
-- STANDINGS VIEW  (computed, no stored duplication)
-- ============================================================
create or replace view standings as
select
  t.id                                              as team_id,
  t.name                                            as team_name,
  t.organization_id,
  t.league_id,
  t.tournament_id,
  t.wins,
  t.losses,
  coalesce(sum(
    case when g.home_team_id = t.id then g.home_score
         when g.away_team_id = t.id then g.away_score
         else 0 end
  ) filter (where g.status = 'final'), 0)           as runs_for,
  coalesce(sum(
    case when g.home_team_id = t.id then g.away_score
         when g.away_team_id = t.id then g.home_score
         else 0 end
  ) filter (where g.status = 'final'), 0)           as runs_against,
  case when (t.wins + t.losses) = 0 then 0
       else round(t.wins::numeric / (t.wins + t.losses), 3)
  end                                               as win_pct
from teams t
left join games g
  on (g.home_team_id = t.id or g.away_team_id = t.id)
  and g.status = 'final'
group by t.id, t.name, t.organization_id, t.league_id, t.tournament_id, t.wins, t.losses;

-- ============================================================
-- RULES
-- ============================================================
create type event_type as enum ('league', 'tournament');

create table rules (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  title           text not null,
  body            text not null,
  age_group       text,
  event_type      event_type,
  order_index     integer not null default 0,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- MESSAGE BOARD
-- ============================================================
create table board_categories (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name            text not null,
  order_index     integer not null default 0
);

create table board_threads (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  category_id     uuid not null references board_categories(id) on delete cascade,
  author_id       uuid not null references profiles(id) on delete cascade,
  title           text not null,
  body            text not null,
  pinned          boolean not null default false,
  created_at      timestamptz not null default now()
);

create table board_comments (
  id              uuid primary key default uuid_generate_v4(),
  thread_id       uuid not null references board_threads(id) on delete cascade,
  author_id       uuid not null references profiles(id) on delete cascade,
  body            text not null,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_profiles_org         on profiles(organization_id);
create index idx_leagues_org          on leagues(organization_id);
create index idx_tournaments_org      on tournaments(organization_id);
create index idx_teams_org            on teams(organization_id);
create index idx_teams_league         on teams(league_id);
create index idx_teams_tournament     on teams(tournament_id);
create index idx_players_team         on players(team_id);
create index idx_players_org          on players(organization_id);
create index idx_games_org            on games(organization_id);
create index idx_games_league         on games(league_id);
create index idx_games_tournament     on games(tournament_id);
create index idx_games_scheduled_at   on games(scheduled_at);
create index idx_rules_org            on rules(organization_id);
create index idx_threads_category     on board_threads(category_id);
create index idx_threads_org          on board_threads(organization_id);
create index idx_comments_thread      on board_comments(thread_id);
