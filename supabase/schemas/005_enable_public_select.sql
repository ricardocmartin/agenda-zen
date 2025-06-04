-- Allow unauthenticated users to read profiles and services

create policy "Public profiles read"
  on profiles
  for select
  using (true);

create policy "Public services read"
  on services
  for select
  using (true);
