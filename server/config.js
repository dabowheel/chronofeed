"use strict";
let assert = require("assert");

let list = [
  "MONGODB_URL",
  "SESSION_SECRET"
];

let config = {};
for (let name of list) {
  assert(process.env[name], "environment variable " + name);
  config[name] = process.env[name];
}

module.exports = config;
