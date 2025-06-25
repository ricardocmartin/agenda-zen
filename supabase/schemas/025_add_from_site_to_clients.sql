alter table clients add column if not exists from_site boolean default false;
alter table clients add column if not exists pending_update boolean default false;

