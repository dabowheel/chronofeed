"use strict";
let assert = require("assert");
let $http = require("es-promise-http");
let users = require("../../mongodb/users");

describe("session", function () {
  let username = "miguel";
  let email = "miguel@me.com";
  let password = "abc";

  it("should sign up a user", function () {
    let options = {
      hostname: "localhost",
      port: global.port,
      method: "POST",
      path: "/api/signup/",
      headers: {
        "Content-Type": "application/json"
      }
    };

    let obj = {
      username: username,
      email: email,
      password: password
    };
    return $http(options, JSON.stringify(obj)).then(function (val) {
      let res = val.response;
      let data = val.data.toString();
      assert.equal(res.statusCode, 200, data);
      let obj = JSON.parse(data);
      assert.equal(obj.username, username);
    });
  });

  it("should login a user", function () {
    let options = {
      hostname: "localhost",
      port: global.port,
      method: "POST",
      path: "/api/login/",
      headers: {
        "Content-Type": "application/json"
      }
    };

    let obj = {
      username: username,
      password: password
    };

    $http(options, JSON.stringify(obj)).then(function (val) {
      let res = val.response;
      let data = val.date.toString();
      assert.equal(res.statusCode, 200, data);
      let obj = JSON.parse(data);
      assert.equal(obj.username, username);
      assert(obj.success);
    });
  });

  after(function () {
    return users.getUserID(global.db, username).then(function (_id) {
      return users.deleteUser(global.db, _id);
    });
  });
});
