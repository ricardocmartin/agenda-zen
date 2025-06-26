create table if not exists expenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  amount numeric not null,
  due_date date not null,
  paid_date date,
  fixed boolean default false,
  repeat_months integer,
  created_at timestamp with time zone default now()
);

alter table expenses enable row level security;

create policy "Users can manage own expenses" on expenses
  for all using (auth.uid() = user_id);
