var fs = require("fs");
var express = require('express');
var app = express();
var datastore = require("./datastore/main");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var datastore_user = require("./datastore/user");
var datastore_session = require("./datastore/session");
var datastore_blogList = require("./datastore/blogList");
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;

app.use(express.static('public'));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use("/datastore", function (req,res,next) {
  MongoClient.connect(process.env.MONGODB_URL, function (error,db) {
    if (error) {
      return next(error);
    }

    req.db = db;
    next();
  });
});

app.post("/datastore/signup",datastore_session.signup);
app.post("/datastore/login",datastore_session.login);
app.post("/datastore/logout",datastore_session.logout);

app.get("/datastore/blogList",datastore_blogList.read);

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
