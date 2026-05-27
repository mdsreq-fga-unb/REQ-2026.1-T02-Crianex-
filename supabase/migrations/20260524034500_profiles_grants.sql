grant all on table public.profiles to service_role;
grant select, insert, update, delete on table public.profiles to authenticated;
grant select on table public.profiles to anon;
