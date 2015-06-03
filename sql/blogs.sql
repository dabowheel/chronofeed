CREATE TABLE blogs (
  blog_id serial PRIMARY KEY,
  title varchar(100),
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH FULL
);
