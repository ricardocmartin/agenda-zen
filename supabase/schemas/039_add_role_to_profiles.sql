alter table profiles add column if not exists role text not null default 'user';
create unique index if not exists unique_admin_per_company on profiles(company_id) where role = 'admin';
