
-- Select
create policy "profiles_self_read"
on public.profiles
for select
to authenticated
using (
    auth.uid() = id
);

-- Update
create policy "owner_update_profiles"
on public.profiles
for update
to authenticated
using (
    exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
        and p.role = 'owner'
    )
)
with check (
    exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
        and p.role = 'owner'
    )
);

-- Insert
create policy "owner_insert_profiles"
on public.profiles
for insert
to authenticated
with check (
    exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
        and p.role = 'owner'
    )
);

-- Delete
create policy "owner_delete_profiles"
on public.profiles
for delete
to authenticated
using (
    exists (
        select 1
        from public.profiles p
        where p.id = auth.uid()
        and p.role = 'owner'
    )
);
