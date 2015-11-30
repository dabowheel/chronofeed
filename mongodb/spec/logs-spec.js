"use strict";
let logs = require("../logs");
let assert = require("assert");

describe("logs DB collection", function () {
	let userID = 1;
	let log = {
		title: "Food Journal"
	};
	let logID = "";

	it("should create a log", function () {
		return logs.createLog(global.db,userID,log).then(function (savedLog) {
			assert.equal(savedLog.title, "Food Journal");
			assert.equal(savedLog.userID, userID);
			assert(savedLog._id);
			logID = savedLog._id.toString();
		});
	});

	it("should update a log", function () {
		let log = {
			title: "Updated Food Journal"
		};
		return logs.updateLog(global.db, userID, logID, log);
	});

	it("should read a log", function () {
		return logs.readLog(global.db, userID, logID).then(function (log) {
			assert.equal(log._id, logID);
			assert.equal(log.title, "Updated Food Journal");
		});
	});

	it("should read many logs", function () {
		return logs.readLogList(global.db, userID).then(function (list) {
			assert(list.length);
			assert(list[0]._id);
		});
	});

	it("should delete a log", function () {
		return logs.deleteLog(global.db, userID, logID).then(function () {
			return logs.readLogList(global.db, userID).then(function (list) {
				list = list.filter(function (log) {
					return log._id == logID;
				});
				assert.equal(list.length, 0);
			});
		});
	});

	it("should delete many logs", function () {
		return logs.createLog(global.db, userID, log).then(function (savedLog) {
			return logs.deleteLogList(global.db, userID).then(function () {
				return logs.readLogList(global.db, userID).then(function (list) {
					assert.equal(list.length, 0);
				});
			});
		});
	});
});
