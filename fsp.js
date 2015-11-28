"use strict";
let fs = require("fs");

function readFile(filename) {
	return new Promise(function (resolve,reject) {
		fs.readFile(filename, function (err,data) {
			if (err) {
				return reject(err);
			}

			resolve(data);
		})
	});
}

function writeFile(filename,data) {
	return new Promise(function (resolve,reject) {
		fs.writeFile(filename, data, function (err) {
			if (err) {
				return reject(err);
			}

			resolve();
		});
	});
}

function readJSON(filename) {
	return new Promise(function (resolve,reject) {
		fs.readFile(filename, function (err,data) {
			if (err) {
				return reject(err);
			}

			resolve(JSON.parse(data));
		});
	});
}

function writeJSON(obj,filename) {
	return new Promise(function (resolve,reject) {
		fs.writeFile(filename, JSON.stringify(obj, null, 2), function (err) {
			if (err) {
				return reject(err);
			}

			resolve();
		});
	});
}

function writeErrors(errorList) {
	for (let err of errorList) {
		if (err.stack) {
			console.error(err.stack);
		} else {
			console.error(err);
		}
	}
}

module.exports.readFile = readFile;
module.exports.writeFile = writeFile;
module.exports.readJSON = readJSON;
module.exports.writeJSON = writeJSON;
module.exports.writeErrors = writeErrors;
