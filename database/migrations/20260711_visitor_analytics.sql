-- Apply this once in the Supabase SQL editor for site-wide visitor analytics.
create table if not exists visitor_stats (
  id uuid primary key default uuid_generate_v4(),
  visitor_hash text not null,
  session_hash text not null,
  path text not null,
  country_code text,
  device_type text,
  browser_name text,
  viewed_at timestamptz not null default now()
);

create index if not exists idx_visitor_stats_viewed on visitor_stats(viewed_at desc);
create index if not exists idx_visitor_stats_visitor on visitor_stats(visitor_hash, viewed_at desc);

alter table visitor_stats enable row level security;
