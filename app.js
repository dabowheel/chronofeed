"use strict";
var fs = require("fs");
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var datastore_session = require("./datastore/session");
var datastore_users = require("./datastore/users");
var datastore_blogs = require("./datastore/blogs");
var datastore_posts = require("./datastore/posts");
var datastore_verify = require("./datastore/verify");
var datastore_reset = require("./datastore/reset");
var datastore_expiringDocs = require("./datastore/expiringDocs");
var compression = require("compression");
var apiRoute = require("./api/route");

MongoClient.connect(process.env.MONGODB_URL, function (error,db) {
  if (error) {
    console.log(error);
    process.exit(1);
  }

  app.use(bodyParser.json());
  app.use(compression({filter: shouldCompress}));
   
  function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header 
      return false;
    }
   
    // fallback to standard filter function 
    return compression.filter(req, res);
  }
  app.use(cookieParser(process.env.SESSION_SECRET));
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      db: db
    })
  }));

  app.use(function (req,res,next) {
    let m = req.originalUrl.match(/.*\.(.*)/);
    if (m) {
      let ext = m[1];
      switch (ext) {
        case "css":
        case "js":
        case "ico":
          res.set("Cache-Control", "max-age=31536000");
          break;
      }
    }
    next();
  });

  apiRoute(app,db);

  app.get("/log/:id/", function (req,res,next) {
    if (!req.session.userID) {
      return res.redirect("/login.html");
    }

    res.sendFile(__dirname + "/public/log.html");
  });

  app.get("/log/:id/designer/", function (req,res,next) {
    if (!req.session.userID) {
      return res.redirect("/login.html");
    }

    res.sendFile(__dirname + "/public/designer.html");
  });

  app.get("/loglist.html", function (req,res,next) {
    if (!req.session.userID) {
      return res.redirect("/login.html");
    }
    
    next();
  });

  app.use(express.static('public'));

  app.use(function(req,res,next) {
    res.status(404).send("Not Found.");
  });

  app.use(function(err,req,res,next) {
    console.log(err.stack);
    res.status(500).send("Application Error. " + err);
  });

  var server = app.listen(80, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
  });
});
