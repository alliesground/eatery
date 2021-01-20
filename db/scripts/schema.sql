CREATE TABLE IF NOT EXISTS items (
  id serial NOT NULL PRIMARY KEY,
  name varchar(20),
  description varchar(20),
  price numeric(8, 2)
);
