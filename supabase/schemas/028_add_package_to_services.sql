alter table services add column if not exists is_package boolean default false;
alter table services add column if not exists session_count integer;
