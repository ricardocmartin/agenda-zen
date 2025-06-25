alter table appointments add column if not exists confirmed boolean default true;
alter table appointments add column if not exists from_site boolean default false;
