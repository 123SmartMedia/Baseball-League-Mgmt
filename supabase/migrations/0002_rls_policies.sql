-- ============================================================
-- 0002_rls_policies.sql
-- Row Level Security — every table is org-scoped
-- ============================================================

-- ── Helper: get the caller's organization_id from their profile ──
create or replace function auth_org_id()
returns uuid language sql stable security definer as $$
  select organization_id from profiles where id = auth.uid()
$$;

-- ── Helper: get the caller's role ──
create or replace function auth_role()
returns user_role language sql stable security definer as $$
  select role from profiles where id = auth.uid()
$$;

-- ============================================================
-- ORGANIZATIONS
-- ============================================================
alter table organizations enable row level security;

-- Members can read their own org
create policy "org: members can read own org"
  on organizations for select
  using (id = auth_org_id());

-- Only admins can update org settings
create policy "org: admins can update"
  on organizations for update
  using (id = auth_org_id() and auth_role() = 'admin');

-- ============================================================
-- PROFILES
-- ============================================================
alter table profiles enable row level security;

-- Members see profiles within their org
create policy "profiles: org members can read"
  on profiles for select
  using (organization_id = auth_org_id());

-- Users can update their own profile
create policy "profiles: own update"
  on profiles for update
  using (id = auth.uid());

-- Admins can insert profiles (invite flow)
create policy "profiles: admins can insert"
  on profiles for insert
  with check (organization_id = auth_org_id() and auth_role() = 'admin');

-- ============================================================
-- LEAGUES
-- ============================================================
alter table leagues enable row level security;

create policy "leagues: org members can read"
  on leagues for select
  using (organization_id = auth_org_id());

create policy "leagues: admins can insert"
  on leagues for insert
  with check (organization_id = auth_org_id() and auth_role() = 'admin');

create policy "leagues: admins can update"
  on leagues for update
  using (organization_id = auth_org_id() and auth_role() = 'admin');

create policy "leagues: admins can delete"
  on leagues for delete
  using (organization_id = auth_org_id() and auth_role() = 'admin');

-- ============================================================
-- TOURNAMENTS
-- ============================================================
alter table tournaments enable row level security;

create policy "tournaments: org members can read"
  on tournaments for select
  using (organization_id = auth_org_id());

create policy "tournaments: admins can insert"
  on tournaments for insert
  with check (organization_id = auth_org_id() and auth_role() = 'admin');

create policy "tournaments: admins can update"
  on tournaments for update
  using (organization_id = auth_org_id() and auth_role() = 'admin');

create policy "tournaments: admins can delete"
  on tournaments for delete
  using (organization_id = auth_org_id() and auth_role() = 'admin');

-- ============================================================
-- TEAMS
-- ============================================================
alter table teams enable row level security;

create policy "teams: org members can read"
  on teams for select
  using (organization_id = auth_org_id());

create policy "teams: admins can insert"
  on teams for insert
  with check (organization_id = auth_org_id() and auth_role() = 'admin');

-- Admins can update any team; coaches can update their own
create policy "teams: admins can update"
  on teams for update
  using (organization_id = auth_org_id() and auth_role() = 'admin');

create policy "teams: coaches can update own team"
  on teams for update
  using (organization_id = auth_org_id() and coach_id = auth.uid());

create policy "teams: admins can delete"
  on teams for delete
  using (organization_id = auth_org_id() and auth_role() = 'admin');

-- ============================================================
-- PLAYERS
-- ============================================================
alter table players enable row level security;

create policy "players: org members can read"
  on players for select
  using (organization_id = auth_org_id());

-- Admins or the team's coach can manage roster
create policy "players: admins can insert"
  on players for insert
  with check (
    organization_id = auth_org_id()
    and (
      auth_role() = 'admin'
      or exists (
        select 1 from teams
        where teams.id = players.team_id
          and teams.coach_id = auth.uid()
      )
    )
  );

create policy "players: admins or coach can update"
  on players for update
  using (
    organization_id = auth_org_id()
    and (
      auth_role() = 'admin'
      or exists (
        select 1 from teams
        where teams.id = players.team_id
          and teams.coach_id = auth.uid()
      )
    )
  );

create policy "players: admins or coach can delete"
  on players for delete
  using (
    organization_id = auth_org_id()
    and (
      auth_role() = 'admin'
      or exists (
        select 1 from teams
        where teams.id = players.team_id
          and teams.coach_id = auth.uid()
      )
    )
  );

-- ============================================================
-- GAMES
-- ============================================================
alter table games enable row level security;

create policy "games: org members can read"
  on games for select
  using (organization_id = auth_org_id());

create policy "games: admins can insert"
  on games for insert
  with check (organization_id = auth_org_id() and auth_role() = 'admin');

create policy "games: admins can update"
  on games for update
  using (organization_id = auth_org_id() and auth_role() = 'admin');

create policy "games: admins can delete"
  on games for delete
  using (organization_id = auth_org_id() and auth_role() = 'admin');

-- ============================================================
-- RULES
-- ============================================================
alter table rules enable row level security;

create policy "rules: org members can read"
  on rules for select
  using (organization_id = auth_org_id());

create policy "rules: admins can insert"
  on rules for insert
  with check (organization_id = auth_org_id() and auth_role() = 'admin');

create policy "rules: admins can update"
  on rules for update
  using (organization_id = auth_org_id() and auth_role() = 'admin');

create policy "rules: admins can delete"
  on rules for delete
  using (organization_id = auth_org_id() and auth_role() = 'admin');

-- ============================================================
-- MESSAGE BOARD
-- ============================================================
alter table board_categories enable row level security;
alter table board_threads enable row level security;
alter table board_comments enable row level security;

-- Categories
create policy "board_categories: org members can read"
  on board_categories for select
  using (organization_id = auth_org_id());

create policy "board_categories: admins manage"
  on board_categories for all
  using (organization_id = auth_org_id() and auth_role() = 'admin');

-- Threads
create policy "board_threads: org members can read"
  on board_threads for select
  using (organization_id = auth_org_id());

create policy "board_threads: members can post"
  on board_threads for insert
  with check (organization_id = auth_org_id() and author_id = auth.uid());

create policy "board_threads: author or admin can update"
  on board_threads for update
  using (
    organization_id = auth_org_id()
    and (author_id = auth.uid() or auth_role() = 'admin')
  );

create policy "board_threads: author or admin can delete"
  on board_threads for delete
  using (
    organization_id = auth_org_id()
    and (author_id = auth.uid() or auth_role() = 'admin')
  );

-- Comments
create policy "board_comments: org members can read"
  on board_comments for select
  using (
    exists (
      select 1 from board_threads bt
      where bt.id = board_comments.thread_id
        and bt.organization_id = auth_org_id()
    )
  );

create policy "board_comments: members can post"
  on board_comments for insert
  with check (author_id = auth.uid());

create policy "board_comments: author or admin can delete"
  on board_comments for delete
  using (
    author_id = auth.uid()
    or auth_role() = 'admin'
  );

-- ============================================================
-- STANDINGS VIEW — grant read to authenticated users
-- ============================================================
grant select on standings to authenticated;
