"use strict";
let assert = require("assert");
let $http = require("http-client-promise");

describe("Log API", function () {
	let log = {
		title: "Food Journal"
	};
	let logID = "";

	it("should create a log", function () {
		let options = {
			hostname: "localhost",
			port: global.port,
			method: "PUT",
			path: "/api/log/",
			headers: {
				"Content-Type": "application/json",
				Cookie: global.cookie
			}
		};
		return $http.request(options, JSON.stringify(log)).then(function (res) {
			return res.getData().then(function (body) {
				assert.equal(res.statusCode, 200, body);
				let newLog = JSON.parse(body);
				assert(newLog._id);
				logID = newLog._id;
			});
		});
	});

	it("should update a log", function () {
		let options = {
			hostname: "localhost",
			port: global.port,
			method: "POST",
			path: "/api/log/" + logID + "/",
			headers: {
				"Content-Type": "application/json",
				Cookie: global.cookie
			}
		};

		let log2 = {
			title: "Updated Food Journal"
		};
		return $http.request(options, JSON.stringify(log2)).then(function (res) {
			return res.getData().then(function (body) {
				assert.equal(res.statusCode, 200, body);
			});
		});
	});

	it("should read a log", function () {
		let options = {
			hostname: "localhost",
			port: global.port,
			method: "GET",
			path: "/api/log/" + logID + "/",
			headers: {
				Cookie: global.cookie
			}
		};

		return $http.request(options).then(function (res) {
			return res.getData().then(function (body) {
				assert.equal(res.statusCode, 200, body);
				let obj = JSON.parse(body);
				assert.equal(obj.title, "Updated Food Journal");
				assert(obj.userID);
				assert.equal(obj._id, logID);
			});
		});
	});

	it("should read many logs", function () {
		let options = {
			hostname: "localhost",
			port: global.port,
			method: "GET",
			path: "/api/log/",
			headers: {
				Cookie: global.cookie
			}
		};

		return $http.request(options).then(function (res) {
			return res.getData().then(function (body) {
				assert.equal(res.statusCode, 200, body);
				let obj = JSON.parse(body);
				assert(obj.list.length);
			});
		});
	});

	it("should delete a log", function () {
		let options = {
			hostname: "localhost",
			port: global.port,
			method: "DELETE",
			path: "/api/log/" + logID + "/",
			headers: {
				Cookie: global.cookie
			}
		};

		return $http.request(options).then(function (res) {
			return res.getData().then(function (body) {
				assert.equal(res.statusCode, 200, body);

				let options = {
					hostname: "localhost",
					port: global.port,
					method: "GET",
					path: "/api/log/",
					headers: {
						Cookie: global.cookie
					}
				};
				return $http.request(options).then(function (res) {
					return res.getData().then(function (body) {
						assert.equal(res.statusCode, 200);
						let obj = JSON.parse(body);

						let list = obj.list.filter(function (log) {
							return log._id == logID;
						});
						assert.equal(list.length, 0);
					});
				});
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
				Cookie: global.cookie
			}
		};
		return $http.request(options).then(function (res) {
			return res.getData().then(function (body) {
				assert.equal(res.statusCode, 200, body);

				let options = {
					hostname: "localhost",
					port: global.port,
					method: "DELETE",
					path: "/api/log/",
					headers: {
						Cookie: global.cookie
					}
				};
				
				return $http.request(options).then(function (res) {
					return res.getData().then(function (body) {
						assert.equal(res.statusCode, 200, body);
			
						let options = {
							hostname: "localhost",
							port: global.port,
							method: "GET",
							path: "/api/log/",
							headers: {
								Cookie: global.cookie
							}
						};

						return $http.request(options).then(function (res) {
							return res.getData().then(function (body) {
								assert.equal(res.statusCode, 200, body);
								let obj = JSON.parse(body);
								assert.equal(obj.list.length, 0);
							});
						});
					});
				});
			});
		});
	});
});
