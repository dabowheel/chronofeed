var fs = require("fs");
var express = require('express');
var app = express();
var cookieParser = require("cookie-parser");
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var datastore_session = require("./datastore/session");
var datastore_users = require("./datastore/users");
var datastore_blogs = require("./datastore/blogs");
var datastore_posts = require("./datastore/posts");

app.use(express.static('public'));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    url: process.env.MONGODB_URL
  })
}));

app.get("/blog/*", function (req,res,next) {
  res.sendFile(__dirname + "/public/index.html");
});

app.use("/datastore", function (req,res,next) {
  MongoClient.connect(process.env.MONGODB_URL, function (error,db) {
    if (error) {
      return next(error);
    }

    req.db = db;
    next();
  });
});

app.get("/datastore/session",datastore_session.session);
app.post("/datastore/signup",datastore_session.signup);
app.post("/datastore/login",datastore_session.login);
app.get("/datastore/logout",datastore_session.logout);

app.get("/datastore/userList", datastore_users.userList);
app.delete("/datastore/deleteUser", datastore_users.deleteUser);
app.get("/datastore/getProfile", datastore_users.getProfile);
app.post("/datastore/saveProfile", datastore_users.saveProfile);

app.get("/datastore/readBlogList", datastore_blogs.readBlogList);
app.post("/datastore/createBlog", datastore_blogs.createBlog);
app.delete("/datastore/deleteBlog", datastore_blogs.deleteBlog);
app.post("/datastore/readBlog", datastore_blogs.readBlog);
app.post("/datastore/saveBlogTitle", datastore_blogs.saveBlogTitle);

app.post("/datastore/updatePost", datastore_posts.updatePost);
app.post("/datastore/createPost", datastore_posts.createPost);
app.delete("/datastore/deletePost", datastore_posts.deletePost);

app.use(function(req,res,next) {
  res.status(404).send("Not Found.");
});

app.use(function(err,req,res,next) {
  res.status(500).send("Application Error. " + err);
});

var server = app.listen(80, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
