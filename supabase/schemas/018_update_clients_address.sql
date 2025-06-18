alter table clients drop column if exists address;
alter table clients add column if not exists cep text;
alter table clients add column if not exists street text;
alter table clients add column if not exists number text;
alter table clients add column if not exists complement text;
alter table clients add column if not exists neighborhood text;
alter table clients add column if not exists state_id integer references states(id);
alter table clients add column if not exists city_id integer references cities(id);
