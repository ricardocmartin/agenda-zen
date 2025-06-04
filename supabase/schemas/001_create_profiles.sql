create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  business_name text,
  description text,
  phone text,
  whatsapp text,
  email text,
  address text,
  instagram text,
  facebook text,
    youtube text,
    x text,
    color text,
    avatar_url text,
    created_at timestamp with time zone default now()
  );

alter table profiles enable row level security;

create policy "Users can manage own profile"
  on profiles for all
  using (auth.uid() = id);

alter table profiles add column if not exists slug text;
