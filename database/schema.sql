create extension if not exists "uuid-ossp";
create extension if not exists vector;

create table if not exists companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  logo text,
  career_url text not null,
  domain text not null unique,
  verified boolean not null default true,
  category text not null,
  description text,
  headquarters text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists jobs (
  id text primary key,
  title text not null,
  company_id uuid references companies(id) on delete set null,
  source_url text not null,
  official_apply_url text not null,
  source_domain text not null,
  location text,
  country text default 'India',
  salary_min numeric,
  salary_max numeric,
  currency text,
  skills text[] not null default '{}',
  eligibility text,
  deadline date,
  opened_at date,
  job_type text not null,
  categories text[] not null default '{}',
  is_remote boolean not null default false,
  is_fresher boolean not null default false,
  is_verified boolean not null default false,
  is_active boolean not null default true,
  verification_status text not null default 'review_required',
  confidence_score numeric not null default 0,
  duplicate_key text,
  ai_summary text,
  priority_score numeric not null default 0,
  embedding vector(1536),
  last_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists users (
  id text primary key,
  email text not null,
  display_name text,
  photo_url text,
  created_at timestamptz not null default now()
);

create table if not exists saved_jobs (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null references users(id) on delete cascade,
  job_id text not null references jobs(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, job_id)
);

create table if not exists job_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique
);

create table if not exists search_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id text references users(id) on delete set null,
  query text,
  filters jsonb not null default '{}',
  result_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists ai_confidence_scores (
  id uuid primary key default uuid_generate_v4(),
  job_id text not null references jobs(id) on delete cascade,
  provider text not null,
  score numeric not null,
  reasons text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists refresh_logs (
  id uuid primary key default uuid_generate_v4(),
  status text not null,
  inserted_count integer not null default 0,
  updated_count integer not null default 0,
  expired_count integer not null default 0,
  rejected_count integer not null default 0,
  message text,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id text references users(id) on delete cascade,
  job_id text references jobs(id) on delete cascade,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
