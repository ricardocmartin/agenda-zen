create table if not exists receipts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  client_id uuid references clients(id) on delete cascade,
  template_id uuid references receipt_templates(id) on delete set null,
  start_date date not null,
  end_date date not null,
  content text not null,
  created_at timestamp with time zone default now()
);

alter table receipts enable row level security;

create policy "Users can manage own receipts" on receipts
  for all using (auth.uid() = user_id);
