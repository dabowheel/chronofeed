"use strict";
let verify = require("../verify");
let assert = require("assert");

describe("verify", function () {
  let userID = "userid1";
  let email = "user@domain.com";

  it("should start verification", function () {
    verify.startVerify(global.db, userID, email).then(function (result) {
      assert(result.code);
      assert(result.hash);
    });
  });

  it("should cleanup expired docs", function () {
    verify.cleanupExpired(global.db, "verify", 0).then(function (result) {
      assert(result.deletedCount);
    });
  });
});
