-- The protect_profile_roles trigger uses auth.uid() to block non-owner clients
-- from escalating role/status. When the backend uses the service role key,
-- auth.uid() returns NULL (no JWT context). This caused the backend to be
-- blocked when creating a member with role='owner'.
-- Fix: allow NULL auth.uid() (service role) to bypass the restriction.
create or replace function public.protect_profile_roles()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Service role calls have no JWT context (auth.uid() IS NULL) — always allow.
  if auth.uid() is null then
    return new;
  end if;

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
