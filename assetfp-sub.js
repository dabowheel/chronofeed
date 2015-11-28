"use strict";
let minimist = require("minimist");
let fs = require("fs");
let fsp = require("./fsp");

let argv = minimist(process.argv.splice(2));
let fileList = argv._;
let manifestFileName = fileList.shift();

let usage = "Usage: assetfp-sub <manifest-file> <sub-file>..."

if (!manifestFileName) {
	console.error(usage)
}

if (fileList.length < 1) {
	console.error(usage);
}

function replaceFiles(manifest,fileList) {
	return fileList.map(function (filename) {
		return fsp.readFile(filename).then(function (data) {
			data = data.toString();
			for (let str1 in manifest) {
				data = data.replace(str1, manifest[str1]);
			}
			return fsp.writeFile(filename, data).then(function (val) {
				console.log("wrote", filename);
			}).catch(function (err) {
				errorList.push(err);
			});
		}).catch(function (err) {
			errorList.push(err);
		});
	});
}

function writeResults(promiseList,errorList) {
	Promise.all(promiseList).then(function (values) {
		if (errorList.length) {
			fsp.writeErrors(errorList);
			process.exit(1);
		}
	});
}

let errorList = [];
fsp.readJSON(manifestFileName).then(function (manifest) {
	let promiseList = replaceFiles(manifest, fileList);
	writeResults(promiseList, errorList);
});

