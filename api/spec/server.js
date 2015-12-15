"use strict";
var express = require('express');
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
var route = require("../route");
var routeErrors = require("../../server/routeErrors");
let assert = require("assert");
let $http = require("http-client-promise");
let users = require("../../mongodb/users");


before("server", function () {
	global.username = "apiuser";
	global.email = "apiuser@me.com";
	global.password = "abc";

  let p;
  if (global.db) {
    p = Promise.resolve(global.db);
  } else {
  	p = MongoClient.connect(process.env.MONGODB_TEST_URL);
  }

  return p.then(function (db) {
		let app = express();
		app.use(bodyParser.json());
	  app.use(session({
	    secret: process.env.SESSION_SECRET,
	    resave: false,
	    saveUninitialized: false,
	    cookie: {
	      maxAge: 1000*60*60*24*14
	    },
	    store: new MongoStore({
	      db: db
	    })
	  }));

		route(app,db);
		global.db = db;
		routeErrors(app);

		global.port = 3000;
    return new Promise(function (resolve,reject) {
  	  global.server = app.listen(global.port, function () {
  	    var host = global.server.address().address;
  	    var port = global.server.address().port;

  	    resolve(deleteUser(global.username).catch(function () {
  	    }).then(function () {
  		    return signup();
  		  }));
  	  });
    });
	});
});

after("server", function () {
  return new Promise(function (resolve,reject) {
    global.server.close(function (err) {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
});

function deleteUser(username) {
  return users.getUserID(global.db, username).then(function (_id) {
    return users.deleteUser(global.db, _id);
  });
}

function signup() {
  let options = {
    hostname: "localhost",
    port: global.port,
    method: "POST",
    path: "/api/signup/",
    headers: {
      "Content-Type": "application/json"
    }
  };

  let obj = {
    username: global.username,
    email: global.email,
    password: global.password
  };
  return $http.request(options, JSON.stringify(obj)).then(function (res) {
    return res.getData().then(function (body) {
      assert.equal(res.statusCode, 200, body);
      global.cookie = res.headers["set-cookie"][0].split("; ")[0];
      let obj = JSON.parse(body);
      assert.equal(obj.username, global.username);
    });
  });
}
