CREATE TABLE users (
  user_id serial PRIMARY KEY,
  username varchar(30) UNIQUE,
  password varchar(64),
  email varchar(40) UNIQUE
);
