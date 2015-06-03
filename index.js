var fs = require("fs");
var express = require('express');
var app = express();
var datastore = require("./datastore/main");
var cookieParser = require("cookie-parser");
var session = require("express-session");

app.use(express.static('public'));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.post("/datastore/main/", datastore.processRequest);


var server = app.listen(80, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
