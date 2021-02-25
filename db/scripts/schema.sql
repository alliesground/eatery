CREATE TABLE IF NOT EXISTS items (
  id serial NOT NULL PRIMARY KEY,
  name varchar(20),
  description varchar(20),
  price numeric(8, 2)
);

CREATE TABLE IF NOT EXISTS images (
  id INT GENERATED ALWAYS AS IDENTITY,
  item_id INT,
  url TEXT,
  PRIMARY KEY(id),
  CONSTRAINT fk_item
    FOREIGN KEY(item_id)
      REFERENCES items(id)
      ON DELETE CASCADE
);
