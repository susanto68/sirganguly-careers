insert into job_categories(name, slug) values
  ('Government', 'government-jobs'),
  ('Private', 'private-jobs'),
  ('Internship', 'internship'),
  ('Freshers', 'freshers'),
  ('Remote', 'remote-jobs'),
  ('Banking', 'banking'),
  ('Railway', 'railway'),
  ('Teaching', 'teaching-jobs'),
  ('IT', 'it-companies'),
  ('Startup', 'startup'),
  ('International', 'abroad-jobs')
on conflict (slug) do nothing;
