"use strict";
let users = require("../users");
let assert = require("assert");

describe("users", function () {
  let username = "miguel";
  let password = "abc";
  let email = "miguel@me.com";
  let _id;
  it ("should signup a user", function () {
    return users.signup(global.db, username, email, password).then(function (result) {
      assert.equal(result.username, username);
      _id = result._id;
      assert(result._id);
    });
  });

  it("should login a user", function () {
    return users.login(global.db, "miguel", "abc").then(function (result) {
      assert.equal(result.username, "miguel");
      assert.equal(result._id, _id);
    });
  });

  it("should delete a user", function () {
    return users.deleteUser(global.db, _id);
  });
});
