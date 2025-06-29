alter table profiles add column if not exists company_id uuid references companies(id);
