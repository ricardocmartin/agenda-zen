create table if not exists cities (
  id integer primary key,
  state_id integer references states(id),
  name text not null
);
