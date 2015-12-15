"use strict";
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;

before("connect", function () {
	if (!process.env.MONGODB_TEST_URL) {
		throw new Error("Environment variable, MONGODB_TEST_URL, not defined");
	}

	let p;
	if (global.db) {
		p = Promise.resolve(global.db);
	} else {
		p = MongoClient.connect(process.env.MONGODB_TEST_URL);
	}

	return p.then(function (db) {
	  global.db = db;
	});
});

after("disconnect", function () {
	if (global.db) {
		return global.db.close().then(function () {
			delete global.db;
		});
	}
});
