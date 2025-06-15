alter table appointments add column if not exists room_id uuid references rooms(id) on delete set null;
