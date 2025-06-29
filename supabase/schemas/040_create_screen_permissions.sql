create table if not exists screen_permissions (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id) on delete cascade,
  screen text not null,
  can_view boolean default true,
  created_at timestamp with time zone default now()
);

alter table screen_permissions enable row level security;

create policy "Owner can manage own permissions" on screen_permissions
  for all using (auth.uid() = profile_id);

create policy "Company admin can manage screen permissions" on screen_permissions
  for all using (
    exists (
      select 1 from profiles p_admin
      join profiles p_user on p_admin.company_id = p_user.company_id
      where p_admin.id = auth.uid() and p_admin.role = 'admin' and p_user.id = screen_permissions.profile_id
    )
  );
