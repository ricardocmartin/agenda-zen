create table if not exists appointments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  client_id uuid references clients(id) on delete cascade,
  service_id uuid references services(id) on delete set null,
  date date not null,
  time time not null,
  duration text,
  description text,
  created_at timestamp with time zone default now()
);

alter table appointments enable row level security;

create policy "Users can manage own appointments" on appointments
  for all using (auth.uid() = user_id);
