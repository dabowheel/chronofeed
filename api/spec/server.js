"use strict";
var express = require('express');
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var route = require("../route");
var routeErrors = require("../../server/routeErrors");

before(function (done) {
	MongoClient.connect(process.env.MONGODB_TEST_URL, function (err,db) {
	  if (err) {
	  	throw err;
	  }

		let app = express();
		app.use(bodyParser.json());
		global.userID = "userid1";
		app.use(function (req,res,next) {
			req.session = {
				userID: global.userID
			};
			next();
		});
		route(app,db);
		global.db = db;
		routeErrors(app);

		global.port = 3000;
	  global.server = app.listen(global.port, function () {
	    var host = global.server.address().address;
	    var port = global.server.address().port;
	    done();
	  });
	});
});

after(function () {
	global.server.close();
});
