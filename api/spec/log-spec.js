"use strict";
let assert = require("assert");
let http = require("http");

describe("log api", function () {
	let log = {
		title: "Food Journal"
	};
	let logID = "";

	it("should create a log", function (done) {
		let options = {
			hostname: "localhost",
			port: global.port,
			method: "PUT",
			path: "/api/log/",
			headers: {
				"Content-Type": "application/json"
			}
		};
		let body = "";
		let req = http.request(options, function (res) {
			assert.equal(res.statusCode, 200);
			res.on("data", function (data) {
				body += data.toString();
			});
			res.on("end", function () {
				let newLog = JSON.parse(body);
				assert(newLog._id);
				logID = newLog._id;
				done();
			});
		});
		req.on("error", function (err) {
			throw err;
		});
		req.write(JSON.stringify(log));
		req.end();
	});

	it("should update a log", function (done) {
		let options = {
			hostname: "localhost",
			port: global.port,
			method: "POST",
			path: "/api/log/" + logID + "/",
			headers: {
				"Content-Type": "application/json"
			}
		};
		let body = "";

		let req = http.request(options, function (res) {
			assert.equal(res.statusCode, 200);
			res.on("data", function (data) {
				body += data.toString();
			});
			res.on("end", function () {
				done();
			});
		})
		req.on("error", function (err) {
			throw err;
		});
		let log = {
			title: "Updated Food Journal"
		};
		req.write(JSON.stringify(log));
		req.end();
	});
});
