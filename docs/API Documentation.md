# API Documentation

## Session
The user doesn't have to logged in for these calls.
* GET /datastore/session
```
{
   username: <username if logged in, otherwise not set>
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
* POST /datastore/forgotPassword
```
{
  username: <username>
}
```
* POST /datastore/resetPassword
```
{
  hash: <SHA-256 email address>,
  code: <code>,
  password: <SHA-256 new password>
}
```
* POST /datastore/verifyEmail
```
{
  hash: <SHA-256 email address>,
  code: <code>
}
```

## [User Profile](../model/userList.js)
The user must be logged in for these calls.
* GET /datastore/Profile
```
{
  username: <username>,
  email: <email>,
  emailVerified: <true or false>,
  joinedDate: <date>
}
```
* PUT /datastore/Profile
```
{
  email: <email address>,
  password: <SHA-256 new password>
}
```
```
{
  checkEmail: <true or false>
}
```
* GET /datastore/resendVerification

## [BlogList](../model/blogList.js)
* GET /datstore/BlogList

## [Blog](../model/blog.js)
* GET /datastore/Blog/:title
* PUT /datastore/Blog
* PUT /datastore/Blog/:title
* DELETE /datastore/Blog/:title

## [Post](../model/post.js)
* PUT /datastore/Post
* PUT /datastore/Post/:id
* DELETE /datastore/Post/:id
