-- Allow members of the same company to insert profiles for new users
create policy "Company members can add profiles" on profiles
  for insert with check (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.company_id = profiles.company_id
    )
  );

-- Company members can read clients of all users in the company
create policy "Company members can read company clients" on clients
  for select using (
    exists (
      select 1 from profiles p1
      join profiles p2 on p1.company_id = p2.company_id
      where p1.id = auth.uid() and p2.id = clients.user_id
    )
  );

-- Company members can read company services
create policy "Company members can read company services" on services
  for select using (
    exists (
      select 1 from profiles p1
      join profiles p2 on p1.company_id = p2.company_id
      where p1.id = auth.uid() and p2.id = services.user_id
    )
  );

-- Company members can read company rooms
create policy "Company members can read company rooms" on rooms
  for select using (
    exists (
      select 1 from profiles p1
      join profiles p2 on p1.company_id = p2.company_id
      where p1.id = auth.uid() and p2.id = rooms.user_id
    )
  );

-- Company members can read company expenses
create policy "Company members can read company expenses" on expenses
  for select using (
    exists (
      select 1 from profiles p1
      join profiles p2 on p1.company_id = p2.company_id
      where p1.id = auth.uid() and p2.id = expenses.user_id
    )
  );

-- Company members can read company appointments
create policy "Company members can read company appointments" on appointments
  for select using (
    exists (
      select 1 from profiles p1
      join profiles p2 on p1.company_id = p2.company_id
      where p1.id = auth.uid() and p2.id = appointments.user_id
    )
  );

-- Company members can read company receipts
create policy "Company members can read company receipts" on receipts
  for select using (
    exists (
      select 1 from profiles p1
      join profiles p2 on p1.company_id = p2.company_id
      where p1.id = auth.uid() and p2.id = receipts.user_id
    )
  );

-- Company members can read company receipt templates
create policy "Company members can read company receipt templates" on receipt_templates
  for select using (
    exists (
      select 1 from profiles p1
      join profiles p2 on p1.company_id = p2.company_id
      where p1.id = auth.uid() and p2.id = receipt_templates.user_id
    )
  );

-- Company members can read company appointment notes
create policy "Company members can read company appointment notes" on appointment_notes
  for select using (
    exists (
      select 1 from profiles p1
      join profiles p2 on p1.company_id = p2.company_id
      where p1.id = auth.uid() and p2.id = appointment_notes.user_id
    )
  );
