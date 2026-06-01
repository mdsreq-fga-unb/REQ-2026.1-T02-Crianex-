-- Restaura o Google OAuth guard revertido pela migration 20260529180000.
-- Essa migration sobrescrevia handle_new_user() sem o check de provider
-- e definia status default como 'active', anulando o 20260529000200.

-- 1. Restaura default de status para 'inactive'
alter table public.profiles
  alter column status set default 'inactive';

-- 2. Restaura handle_new_user() com guard de provider Google e status 'inactive'
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
declare
  provider text := coalesce(new.raw_app_meta_data ->> 'provider', '');
begin
  -- Google users são validados no callback; não criar profile aqui
  -- para evitar acúmulo de entradas de contas não autorizadas.
  if provider = 'google' then
    return new;
  end if;

  insert into public.profiles (id, name, email, role, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'Membro'),
    new.email,
    'member',
    'inactive'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;
