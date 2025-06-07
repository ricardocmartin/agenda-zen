create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  message text not null,
  created_at timestamp with time zone default now()
);

alter table contacts enable row level security;

create policy "Public can insert contact" on contacts
  for insert with check (true);
