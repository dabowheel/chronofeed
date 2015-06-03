CREATE TABLE posts (
	post_id serial PRIMARY KEY,
  title varchar(100),
	post text,
	date timestamp,
  blog_id INTEGER,
	user_id INTEGER,
  FOREIGN KEY (blog_id) REFERENCES blogs (blog_id) MATCH FULL,
	FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH FULL
);
