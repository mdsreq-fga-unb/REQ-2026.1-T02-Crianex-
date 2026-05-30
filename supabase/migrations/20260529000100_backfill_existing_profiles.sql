insert into public.profiles (id, email, role, status)
select
    u.id,
    lower(u.email),
    'member',
    'active'
from auth.users u
where u.email is not null
  and not exists (select 1 from public.profiles p where p.id = u.id)
  and not exists (select 1 from public.profiles p where lower(p.email) = lower(u.email));
