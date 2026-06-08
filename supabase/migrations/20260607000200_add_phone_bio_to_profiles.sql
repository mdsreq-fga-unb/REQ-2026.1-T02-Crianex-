alter table public.profiles
  add column if not exists phone text default null,
  add column if not exists bio   text default null;
