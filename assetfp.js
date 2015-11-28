"use strict";
let minimist = require("minimist");
let fs = require("fs");
let crypto = require("crypto");
let path = require("path");
let child_process = require("child_process");
let fsp = require("./fsp");

let argv = minimist(process.argv.splice(2));
let destDir = argv.dest || argv.d || "";
let workingDir = argv["working-dir"] || argv.w || "";
let manifestFilename = argv.output || argv.o || "";
let appendManifest = argv["append-manifest"] || argv.a || false;
let npmVersion = argv["npm-version"] || argv.n || false;
let bowerVersion = argv["bower-version"] || argv.b || false;
let fileList = argv._;


/*
Copy files to and put a fingerprint in the name
  fileList (input) - the list of files to copy and fingerprint
  manifest (output) - the manifest of files
  errorList (output) - list of errors if any
  return value - list of promises for created files
*/
function createFiles(fileList,manifest,errorList) {
	return fileList.map(function (filename) {
		let p = new Promise(function (resolve,reject) {
			fs.readFile(filename, function (err, data) {
				if (err) {
					return reject(err);
				}

				let p;
				if (npmVersion) {
					p = getPackageVersion("npm", npmVersion);
				} else if (bowerVersion) {
					p = getPackageVersion("bower", bowerVersion);
				} else {
					let md5 = crypto.createHash("md5");
					md5.update(data);
					p = Promise.resolve(md5.digest("hex"));
				}

				p.then(function (val) {
					let m = filename.match(/([^.]*)\.(.*)/);
					let newFilename;
					if (m) {
						newFilename = m[1] + "-" + val + "." + m[2];
					} else {
						newFilename = filename + "-" + val;
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
				}, function(val) {
					reject(val);
				});
			});
		});
		return p.then(function (val) {
			return true;
		}, function (val) {
			errorList.push(val);
			return false;
		});
	});
}

function writeResults(promiseList,manifest,errorList,workingDir,manifestFilename,appendManifest) {
	Promise.all(promiseList).then(function (values) {
		if (errorList.length) {
			fsp.writeErrors(errorList);
			process.exit(1);
			return;
		}

		if (manifestFilename) {
			if (workingDir) {
				manifestFilename = path.join(workingDir, manifestFilename);
			}
			writeManifest(manifest, manifestFilename, appendManifest, workingDir).then(function (val) {
				console.log("wrote",manifestFilename);
			}).catch(function (err) {
				if (err.stack) {
					console.error(err.stack);
				} else {
					console.error(err);
				}
				process.exit(1);
			});
		}
	});
}

/*
Write the results in the manifest
Display any errors
*/
function writeManifest(manifest,manifestFilename,appendManifest, workingDir) {
	return new Promise(function (resolve,reject) {
		manifest = transformManifest(manifest, workingDir);

		let appendPromise;
		if (appendManifest) {
			appendPromise = fsp.readJSON(manifestFilename);
		} else {
			appendPromise = Promise.resolve({});
		}

		appendPromise.then(function (oldManifest) {
			manifest = Object.assign(oldManifest, manifest);
			resolve(fsp.writeJSON(manifest, manifestFilename));
		}).catch(function (err) {
			if (err.message.match(/ENOENT: no such file or directory/)) {
				resolve(fsp.writeJSON(manifest, manifestFilename));
			} else {
				reject(err);
			}
		});
	});
}

function transformManifest(manifest,workingDir) {
	let ret = {};
	for (let filename in manifest) {
		let val = manifest[filename];
		if (workingDir) {
			filename = removeBasePath(workingDir, filename);
			val = removeBasePath(workingDir, val);
		}
		ret[filename.replace(/\\/g, "/")] = val.replace(/\\/g, "/");
	}
	return ret;
}

function removeBasePath(base,filename) {
	base = path.normalize(base);
	filename = path.normalize(filename);
	let filenameArray = filename.split(path.sep);
	let baseArray = base.split(path.sep);
	let ret = filenameArray.splice(baseArray.length).join(path.sep);
	return ret;
}

/*
Get the version of a package
  command (input) - the package manager command: npm or bower
  packageName (input) - the package name
  return value - promise for package version number
*/
function getPackageVersion(command,packageName) {
	let sep;
	if (command == "npm") {
		sep = "@";
	} else if (command == "bower") {
		sep = "#";
	} else {
		return Promise.reject("Unsupported package command");
	}

	if (!packageName) {
		return Promise.reject("Package name not specified");
	}

	return new Promise(function (resolve,reject) {
		let npm = child_process.exec(command + " list " + packageName);
		let output = "";
		let version = "";
		npm.stdout.on("data", function (data) {
			output += data;
			console.log(data);
		});
		npm.stderr.on("data", function (data) {
			console.log(data);
		});
		npm.on("close", function (code) {
			if (!code) {
				let reText = packageName + sep + "(\\d*\\.\\d*\\.\\d*)";
				let re = new RegExp(reText);
				let m = output.match(re);
				if (m) {
					version = m[1];
					return resolve(version);
				}
			}
			reject("Could not get version");
		});
		npm.on("error", function (err) {
			console.log(err);
		});
	});
}

function getFiles(files, list, errorList) {
	let promiseList = files.map(function (filename) {
		return isDirectory(filename).then(function (val) {
			if (val) {
				return readDirectory(filename).then(function (files) {
					files = files.map(function (filename2) {
						return path.join(filename, filename2);
					});
					return getFiles(files, list, errorList).catch(function (err) {
						errorList.push(err);
					});
				}).catch(function (err) {
					errorList.push(err);
				});
			} else {
				list.push(filename);
			}
		}).catch(function (val) {
			errorList.push(val);
		});
	});

	return Promise.all(promiseList, function (values) {
	});
}

function isDirectory(path) {
	return new Promise(function (resolve,reject) {
		fs.lstat(path, function (err,stat) {
			if (err) {
				return reject(err);
			}

			resolve(stat.isDirectory());
		});
	});
}

function readDirectory(path) {
	return new Promise(function (resolve,reject) {
		fs.readdir(path, function (err, files) {
			if (err) {
				return reject(err);
			}

			resolve(files);
		});
	});
}

let list = [];
let errorList = [];
if (workingDir) {
	fileList = fileList.map(function (filename) {
		return path.join(workingDir, filename);
	});
}
getFiles(fileList, list, errorList).then(function (val) {
	if (errorList.length) {
		fsp.writeErrors(errorList);
		process.exit(1);
	}

	let manifest = {};
	let promiseList = createFiles(list, manifest, errorList);
	writeResults(promiseList, manifest, errorList, workingDir, manifestFilename, appendManifest);
});
