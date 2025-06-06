create table if not exists rooms (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamp with time zone default now()
);

alter table rooms enable row level security;

create policy "Users can manage own rooms" on rooms
  for all using (auth.uid() = user_id);
