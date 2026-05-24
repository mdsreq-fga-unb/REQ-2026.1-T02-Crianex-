-- Triggers
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin

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
    );

    return new;

end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
