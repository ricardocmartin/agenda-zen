create table if not exists companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text,
  email text,
  address text,
  created_at timestamp with time zone default now()
);

alter table companies enable row level security;

create policy "Authenticated can insert companies" on companies
  for insert with check (auth.uid() is not null);

create policy "Company members can manage company" on companies
  for all using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.company_id = companies.id
    )
  );
