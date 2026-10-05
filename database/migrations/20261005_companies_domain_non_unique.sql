-- Job-board aggregators (Remotive, Arbeitnow) list many employers under one source domain,
-- so companies.domain cannot be unique. companies.slug stays the unique key.
alter table public.companies drop constraint if exists companies_domain_key;
create index if not exists companies_domain_idx on public.companies (domain);
