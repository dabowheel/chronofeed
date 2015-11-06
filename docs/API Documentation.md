# API Documentation

## Session
* GET /datastore/session
```
{
   username: <username>
}
```
* GET /datastore/signup
```
{
   username: <username>,
   email: <email address>,
   password: <SHA-256 password>
}
```
```
{
   username: <username>
}
```
* POST /datastore/login
```
{
   username: <username or email address>,
   password: <SHA-256 password>
}
```
```
{
   username: <username>,
   success: <true or false>
}
```
* GET /datastore/logout

## [BlogList](../model/blogList.js)
* GET /datstore/BlogList

## [Blog](../model/blog.js)
* GET /datastore/Blog/:title
* PUT /datastore/Blog
* PUT /datastore/Blog/:title
* DELETE /datastore/Blog/:title
