-- Existing users get active profiles via backfill (20260529000100).
-- New non-Google users get inactive profiles and must be activated by an owner.
-- Google users are validated at callback time against pre-existing active profiles;
-- creating a profile here would allow unauthorized Google accounts to accumulate entries.

alter table public.profiles
    alter column status set default 'inactive';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
declare
    provider text := coalesce(new.raw_app_meta_data ->> 'provider', '');
begin
    if provider = 'google' then
        return new;
    end if;

    insert into public.profiles (id, email, role, status)
    values (new.id, lower(new.email), 'member', 'inactive')
    on conflict (id) do nothing;

    return new;
end;
$$;
