"use strict";
let minimist = require("minimist");
let fs = require("fs");
let crypto = require("crypto");
let path = require("path");

let argv = minimist(process.argv.splice(2));
let destDir = argv.dest || argv.d || "";
let workingDir = argv["working-dir"] || argv.w || "";
let manifestFilename = argv.output || argv.o || "";
let appendToManifest = argv["append-manifest"] || argv.a || false;
let npmVersion = argv["npm-version"] || argv.n || false;
let bowerVersion = argv["bower-version"] || argv.b || false;
let fileList = argv._;

let manifest = {};
let errorList = [];

let promiseList = fileList.map(function (filename) {
	let p = new Promise(function (resolve,reject) {
		let md5 = crypto.createHash("md5");
		if (workingDir) {
			filename = path.join(workingDir, filename);
		}
		fs.readFile(filename, function (err, data) {
			if (err) {
				return reject(err);
			}

			md5.update(data);
			let d = md5.digest("hex");
			let m = filename.match(/([^.]*)\.(.*)/);
			let newFilename;
			if (m) {
				newFilename = m[1] + "-" + d + "." + m[2];
			} else {
				newFilename = filename + "-" + d;
			}

			manifest[filename] = newFilename;
			resolve(new Promise(function (resolve, reject) {
				fs.writeFile(newFilename, data, function (err) {
					if (err) {
						return reject(err);
					}

					console.log("wrote", newFilename);
					resolve();
				});
			}));
		});
	});
	return p.then(function (val) {
		return true;
	}, function (val) {
		errorList.push(val);
		return false;
	});
});

Promise.all(promiseList).then(function (values) {
	for (let err of errorList) {
		console.error(err.stack);
	}
	if (errorList.length) {
		process.exit(1);
	} else {
		if (manifestFilename) {
			let newManifest = {};
			for (let filename in manifest) {
				newManifest[filename.replace(/\\/g, "/")] = manifest[filename].replace(/\\/g, "/");
			};

			if (workingDir) {
				manifestFilename = path.join(workingDir, manifestFilename);
			}
			let p = new Promise(function (resolve,reject) {
				if (!appendToManifest) {
					return resolve();
				}

				fs.readFile(manifestFilename, function (err,data) {
					if (err) {
						return reject(err);
					}

					let oldManifest = JSON.parse(data);
					Object.assign(newManifest, oldManifest);
					resolve();
				});
			});
			p.then(function (val) {
				fs.writeFile(manifestFilename, JSON.stringify(newManifest, null, 2), function (err) {
					if (err) {
						console.error(err.stack);
						process.exit(1);
					}

					console.log("wrote", manifestFilename);
				});
			}, function (val) {
				console.error(val.stack);
				process.exit(1);
			});
		}
	}
});
