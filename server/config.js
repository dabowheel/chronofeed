"use strict";
let assert = require("assert");

let list = [
  "MONGODB_URL",
  "SESSION_SECRET",
  "CF_EMAIL_FROM",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS"
];

let config = {};
for (let name of list) {
  assert(process.env[name], "environment variable " + name);
  config[name] = process.env[name];
}

module.exports = config;
