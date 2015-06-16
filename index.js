var fs = require("fs");
var express = require('express');
var app = express();
var datastore = require("./datastore/main");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var mongoose = require("mongoose");
var datastore_user = require("./datastore/user");
var datastore_login = require("./datastore/login");

// var db = mongoose.connect(process.env.MONGODB_URL);

app.use(express.static('public'));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.post("/datastore/user", datastore_user.create);
app.get("/datastore/user/:id", datastore_user.read);
app.put("/datastore/user", datastore_user.update);
app.delete("/datastore/user",datastore_user.delete);

app.use("/datastore", function (req,res,next) {
  console.log("connect");
  mongoose.connect(process.env.MONGODB_URL);
  next();
});
app.post("/datastore/login",datastore_login.login);

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
