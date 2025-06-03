create table if not exists clients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  created_at timestamp with time zone default now()
);

alter table clients enable row level security;

create policy "Users can manage own clients" on clients
  for all using (auth.uid() = user_id);
