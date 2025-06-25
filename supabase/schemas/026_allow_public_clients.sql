create policy "Anonymous site clients insert"
  on clients
  for insert
  with check (
    auth.role() = 'anon' and from_site = true
  );

create policy "Anonymous site clients read"
  on clients
  for select
  using (
    auth.role() = 'anon' and from_site = true
  );
