alter table companies enable row level security;
alter table jobs enable row level security;
alter table users enable row level security;
alter table saved_jobs enable row level security;
alter table job_categories enable row level security;
alter table search_logs enable row level security;
alter table ai_confidence_scores enable row level security;
alter table refresh_logs enable row level security;
alter table notifications enable row level security;
alter table articles enable row level security;
alter table visitor_stats enable row level security;
alter table crawler_runs enable row level security;
alter table broken_links enable row level security;

create policy "Public can read verified companies"
  on companies for select
  using (verified = true);

create policy "Public can read active verified jobs"
  on jobs for select
  using (is_active = true and is_verified = true);

create policy "Public can read job categories"
  on job_categories for select
  using (true);

create policy "Public can read published articles"
  on articles for select
  using (published = true);

-- Firebase-authenticated routes should write through server-side service role.
-- Keep direct browser writes disabled by default for safety.

create policy "Users can read their saved jobs"
  on saved_jobs for select
  using (auth.uid()::text = user_id);

create policy "Users can read their notifications"
  on notifications for select
  using (auth.uid()::text = user_id);
