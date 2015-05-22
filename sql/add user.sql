ALTER TABLE posts
ADD COLUMN user_id INTEGER;

ALTER TABLE posts ADD FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH FULL;

ALTER TABLE blogs
ADD COLUMN user_id INTEGER;

ALTER TABLE blogs ADD FOREIGN KEY (user_id) REFERENCES users (user_id) MATCH FULL;


UPDATE posts SET user_id = '1';

UPDATE blogs SET user_id = '1';