"use strict";
let logs = require("../mongodb/logs");

exports.createLog = function (req,res,next) {
	logs.createLog(req.db, req.session.userID, req.body).then(function (log) {
		res.json(log);
	}).catch(function (err) {
		next(err);
	});
};

exports.updateLog = function (req,res,next) {
	logs.updateLog(req.db, req.session.userID, req.api.id, req.body).then(function () {
		res.end();
	}).catch(function (err) {
		next(err);
	});
};

exports.readLogList = function (req,res,next) {
	logs.readLogList(req.db, req.session.userID).then(function (list) {
		res.json({
			list: list
		});
	}).catch(function (err) {
		next(err);
	});
};

exports.readLog = function (req,res,next) {
	logs.readLog(req.db, req.session.userID, req.api.id).then(function (log) {
		res.json(log);
	}).catch(function (err) {
		next(err);
	});
};

exports.deleteLog = function (req,res,next) {
	logs.deleteLog(req.db, req.session.userID, req.api.id).then(function () {
		res.end();
	}).catch(function (err) {
		next(err);
	});
};

exports.deleteLogList = function (req,res,next) {
	logs.deleteLogList(req.db, req.session.userID).then(function () {
		res.end();
	}).catch(function (err) {
		next(err);
	});
};
