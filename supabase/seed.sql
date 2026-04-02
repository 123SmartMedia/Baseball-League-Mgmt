-- ============================================================
-- seed.sql — local development data
-- Run after migrations. Does NOT create auth users
-- (create those via Supabase dashboard or CLI).
-- ============================================================

-- ── Organization ─────────────────────────────────────────────
insert into organizations (id, name, slug, primary_color, accent_color)
values (
  '00000000-0000-0000-0000-000000000001',
  'Riverside Baseball League',
  'riverside',
  '220 90% 50%',
  '12 90% 55%'
);

-- ── Leagues ──────────────────────────────────────────────────
insert into leagues (id, organization_id, name, age_group, season, start_date, end_date)
values
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Spring 2025 – 10U',
    '10U',
    'Spring 2025',
    '2025-04-01',
    '2025-06-30'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Spring 2025 – 12U',
    '12U',
    'Spring 2025',
    '2025-04-01',
    '2025-06-30'
  );

-- ── Tournaments ───────────────────────────────────────────────
insert into tournaments (id, organization_id, name, age_group, start_date, end_date, location, entry_fee_cents)
values (
  '20000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Summer Classic 2025',
  '10U',
  '2025-07-12',
  '2025-07-13',
  'Riverside Sports Complex',
  15000
);

-- ── Teams (10U league) ────────────────────────────────────────
insert into teams (id, organization_id, league_id, name, wins, losses)
values
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Blue Sox',   3, 1),
  ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Red Hawks',  2, 2),
  ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Green Vipers',1, 3),
  ('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Gold Eagles', 4, 0);

-- ── Games (10U league) ────────────────────────────────────────
insert into games (organization_id, league_id, home_team_id, away_team_id, scheduled_at, field, status, home_score, away_score)
values
  -- Past finals
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   '30000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002',
   '2025-04-05 10:00:00-07', 'Field 1', 'final', 7, 3),

  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   '30000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000003',
   '2025-04-05 12:00:00-07', 'Field 2', 'final', 9, 1),

  -- Upcoming scheduled
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   '30000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000004',
   '2025-04-19 10:00:00-07', 'Field 1', 'scheduled', null, null),

  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   '30000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003',
   '2025-04-19 12:00:00-07', 'Field 2', 'scheduled', null, null);

-- ── Rules ─────────────────────────────────────────────────────
insert into rules (organization_id, title, body, age_group, event_type, order_index)
values
  ('00000000-0000-0000-0000-000000000001',
   'Pitch Count Limits',
   'Players aged 10U may throw a maximum of 75 pitches per day. One day of rest is required after 26–50 pitches.',
   '10U', 'league', 1),

  ('00000000-0000-0000-0000-000000000001',
   'Game Duration',
   'Regular season games are limited to 6 innings or 1 hour 45 minutes, whichever comes first.',
   null, 'league', 2),

  ('00000000-0000-0000-0000-000000000001',
   'Mercy Rule',
   'The 10-run mercy rule applies after 4 complete innings.',
   null, 'league', 3),

  ('00000000-0000-0000-0000-000000000001',
   'Tournament Tiebreaker',
   'In the event of a tie in pool play, tiebreakers are resolved by: (1) head-to-head record, (2) run differential (max +8 per game), (3) coin flip.',
   null, 'tournament', 1);

-- ── Board categories ──────────────────────────────────────────
insert into board_categories (organization_id, name, order_index)
values
  ('00000000-0000-0000-0000-000000000001', 'General Discussion', 1),
  ('00000000-0000-0000-0000-000000000001', 'Schedules & Fields', 2),
  ('00000000-0000-0000-0000-000000000001', 'Announcements',      3);
