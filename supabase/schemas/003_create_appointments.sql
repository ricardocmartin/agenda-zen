create table if not exists appointments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  client_id uuid references clients(id) on delete cascade,
  date date not null,
  time time not null,
  description text,
  created_at timestamp with time zone default now()
);

alter table appointments enable row level security;

create policy "Users can manage own appointments" on appointments
  for all using (auth.uid() = user_id);