create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text,
  duration text,
  price numeric,
  created_at timestamp with time zone default now()
);

alter table services enable row level security;

create policy "Users can manage own services" on services
  for all using (auth.uid() = user_id);
