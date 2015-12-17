"use strict";
let users = require("../users");
let assert = require("assert");

describe("users", function () {
  let username = "miguel";
  let password = "abc";
  let email = "user@me.com";
  let _id;
  it ("should signup a user", function () {
    return users.signup(global.db, username, email, password).then(function (result) {
      assert.equal(result.username, username);
      _id = result._id;
      assert(result._id);
    });
  });

  it("should login a user", function () {
    return users.login(global.db, username, password).then(function (result) {
      assert.equal(result.username, username);
      assert.equal(result._id, _id);
    });
  });

  it("should get the user profile", function () {
    return users.getProfile(global.db, _id).then(function (result) {
      assert.equal(result.username, username);
      assert.equal(result.email, email);
      assert.equal(result.emailVerify, false);
      assert(result.joined);
    });
  });

  it ("should update the user password", function () {
    let user = {
      email: "user@me.com",
      password: "abc2"
    };
    return users.updateProfile(global.db, _id, user).then(function (result) {
      assert(!result.checkEmail, "!checkEmail");
    });
  });

  it("should update the user email and password", function () {
    let user = {
      email: "user@me2.com",
      password: "abc2"
    };
    return users.updateProfile(global.db, _id, user).then(function (result) {
      assert(result.checkEmail, "checkEmail");
    });
  });

  it("should delete a user", function () {
    return users.deleteUser(global.db, _id);
  });
});
