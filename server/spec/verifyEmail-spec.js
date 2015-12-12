"use strict";
var verifyEmail = require("../verifyEmail");
var assert = require("assert");
var config = require("../config");

describe("email verification", function () {
  this.timeout(10000);
  let host = "localhost";
  let hash = "hash";
  let code = "code";
  let to = process.env.CF_TEST_EMAIL_TO;
  assert(to);

  it("send email", function () {
    return verifyEmail.sendEmailVerification(host, to, config.CF_EMAIL_FROM, hash, code).then(function (res) {
      assert(res);
    });
  });

});
