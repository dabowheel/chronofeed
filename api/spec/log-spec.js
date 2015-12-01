"use strict";
let assert = require("assert");
let http = require("http");
let $http = require("es-promise-http");

describe("Log API", function () {
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

		let req = http.request(options, function (res) {
			assert.equal(res.statusCode, 200);
			done();
		});
		req.on("error", function (err) {
			throw err;
		});
		let log = {
			title: "Updated Food Journal"
		};
		req.write(JSON.stringify(log));
		req.end();
	});

	it("should read a log", function (done) {
		let options = {
			hostname: "localhost",
			port: global.port,
			method: "GET",
			path: "/api/log/" + logID + "/"
		};

		let req = http.request(options, function (res) {
			assert.equal(res.statusCode, 200);
			let body = "";
			res.on("data", function (data) {
				body += data.toString();
			});
			res.on("end", function () {
				let obj = JSON.parse(body);
				assert.equal(obj.title, "Updated Food Journal");
				assert.equal(obj.userID, global.userID);
				assert.equal(obj._id, logID);
				done();
			});
		});
		req.on("error", function (err) {
			throw err;
		});
		req.end();
	});

	it("should read many logs", function (done) {
		let options = {
			hostname: "localhost",
			port: global.port,
			method: "GET",
			path: "/api/log/"
		};

		let req = http.request(options, function (res) {
			assert.equal(res.statusCode, 200);
			let body = "";
			res.on("data", function (data) {
				body += data.toString();
			});
			res.on("end", function () {
				let obj = JSON.parse(body);
				assert(obj.list.length);
				done();
			});
		});
		req.on("error", function (err) {
			throw err;
		});
		req.end();
	});

	it("should delete a log", function () {
		let options = {
			hostname: "localhost",
			port: global.port,
			method: "DELETE",
			path: "/api/log/" + logID + "/"
		};

		return $http(options).then(function (val) {
			let res = val.response;
			assert.equal(res.statusCode, 200);

			let options = {
				hostname: "localhost",
				port: global.port,
				method: "GET",
				path: "/api/log/"
			};
			return $http(options).then(function (val) {
				let res = val.response;
				let obj = JSON.parse(val.data.toString());
				assert.equal(res.statusCode, 200);

				let list = obj.list.filter(function (log) {
					return log._id == logID;
				});
				assert.equal(list.length, 0);
			});
		});
	});

	it("should delete many logs", function () {
		let options = {
			hostname: "localhost",
			port: global.port,
			method: "PUT",
			path: "/api/log/",
			headers: {
				"Content-Type": "json/application"
			}
		};
		return $http(options).then(function (val) {
			let res = val.response;
			assert.equal(res.statusCode, 200);

			let options = {
				hostname: "localhost",
				port: global.port,
				method: "DELETE",
				path: "/api/log/"
			};
			
			return $http(options).then(function (val) {
				let res = val.response;
				assert.equal(res.statusCode, 200);
	
				let options = {
					hostname: "localhost",
					port: global.port,
					method: "GET",
					path: "/api/log/"
				};
				return $http(options).then(function (val) {
					let res = val.response;
					let obj = JSON.parse(val.data.toString());
					assert.equal(res.statusCode, 200);
					assert.equal(obj.list.length, 0);
				});
			});
		});
	});
});
