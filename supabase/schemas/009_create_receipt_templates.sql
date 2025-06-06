create table if not exists receipt_templates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  content text not null,
  created_at timestamp with time zone default now()
);

alter table receipt_templates enable row level security;

create policy "Users can manage own receipt templates" on receipt_templates
  for all using (auth.uid() = user_id);
