"use strict";
let assert = require("assert");
let $http = require("http-client-promise");
let users = require("../../mongodb/users");
let $request = require("request-promise");
let request = require("request");

describe("session API", function () {
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
      username: global.username,
      password: global.password
    };

    return $http.request(options, JSON.stringify(obj)).then(function (res) {
      return res.getData().then(function (body) {
        assert.equal(res.statusCode, 200, body);
        let obj = JSON.parse(body);
        assert.equal(obj.username, global.username);
        assert(obj.success, "login success");
      });
    });
  });

  it("should get the user profile", function () {
    let options = {
      hostname: "localhost",
      port: global.port,
      method: "GET",
      path: "/api/profile/",
      headers: {
        Cookie: global.cookie
      }
    };

    return $http.request(options).then(function (res) {
      return res.getData().then(function (body) {
        assert.equal(res.statusCode, 200, body);
        let obj = JSON.parse(body);
        assert.equal(obj.username, global.username);
        assert.equal(obj.email, global.email);
        assert.equal(obj.emailVerify, false);
        assert(obj.joined, "joined");
      });
    });
  });

  it("should update the user password", function () {
    let options = {
      uri: "http://localhost:3000/api/profile/",
      body: {
        email: global.email,
        password: global.password + "2"
      },
      headers: {
        Cookie: global.cookie
      },
      json: true
    };
    return $request.post(options).then(function (body) {
      assert(!body.checkEmail, "!checkEmail");
    });
  });

  it("should update the user email", function () {
    let options = {
      uri: "http://localhost:3000/api/profile/",
      body: {
        email: "apiuser@me2.com",
        password: global.password
      },
      headers: {
        Cookie: global.cookie
      },
      json: true
    };
    return $request.post(options).then(function (body) {
      assert(body.checkEmail, "checkEmail");
    });
  });

});
