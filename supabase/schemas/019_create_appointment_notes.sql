create table if not exists appointment_notes (
  id uuid primary key default uuid_generate_v4(),
  appointment_id uuid references appointments(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  note text,
  attachments text[],
  created_at timestamp with time zone default now()
);

alter table appointment_notes enable row level security;

create policy "Users can manage own appointment notes" on appointment_notes
  for all using (auth.uid() = user_id);
