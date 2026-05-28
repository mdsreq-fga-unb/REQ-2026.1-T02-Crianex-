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

    insert into public.profiles (
        id,
        email,
        role,
        status
    )
    values (
        new.id,
        new.email,
        'member',
        'active'
    )
    on conflict (id) do nothing;

    return new;

end;
$$;
