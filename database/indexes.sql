create index if not exists idx_jobs_active_deadline on jobs(is_active, deadline);
create index if not exists idx_jobs_categories on jobs using gin(categories);
create index if not exists idx_jobs_skills on jobs using gin(skills);
create index if not exists idx_jobs_company on jobs(company_id);
create index if not exists idx_jobs_verified_score on jobs(is_verified, confidence_score desc);
create index if not exists idx_jobs_created on jobs(created_at desc);
create index if not exists idx_jobs_duplicate_key on jobs(duplicate_key);
create index if not exists idx_jobs_source_domain on jobs(source_domain);
create index if not exists idx_jobs_title_search on jobs using gin(to_tsvector('english', title || ' ' || coalesce(ai_summary, '')));
create index if not exists idx_saved_jobs_user on saved_jobs(user_id, created_at desc);
create index if not exists idx_search_logs_user on search_logs(user_id, created_at desc);

-- Enable after pgvector extension is available and embeddings are populated.
create index if not exists idx_jobs_embedding on jobs using ivfflat (embedding vector_cosine_ops) with (lists = 100);
