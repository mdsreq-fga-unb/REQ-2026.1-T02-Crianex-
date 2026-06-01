-- Impede que usuários não-owner alterem role ou status do próprio perfil.
-- A policy profiles_member_update (20260529180000) não restringe colunas,
-- o que permitia escalada de privilégio via SDK client-side.
create or replace function public.protect_profile_roles()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (
    old.role is distinct from new.role
    or old.status is distinct from new.status
  )
  and not public.is_owner(auth.uid()) then
    raise exception 'permission denied: only owners can change role or status';
  end if;

  return new;
end;
$$;

create trigger enforce_profile_role_security
before update on public.profiles
for each row
execute function public.protect_profile_roles();
