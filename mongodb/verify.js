"use strict";
let crypto = require("crypto");

exports.startVerify = function (db,userID,email) {
  var verifyInfo = {};
  var h = new crypto.Hash("sha256");
  h.update(email);
  verifyInfo.userID = userID;
  verifyInfo.type = "email";
  verifyInfo.hash = h.digest("hex");
  verifyInfo.code = crypto.randomBytes(256/8).toString("hex");
  verifyInfo.created = new Date();
  var verify = db.collection("verify");

  return verify.insert(verifyInfo).then(function (result) {
    return {
      code: verifyInfo.code,
      hash: verifyInfo.hash
    };
  });
};

exports.cleanupExpired = function (db,collectionName,days) {
  let d = new Date();
  d.setDate(d.getDate() - days);
  let filter = {
    created: {
      $lt: d
    }
  };
  let col = db.collection(collectionName);
  return col.deleteMany(filter).then(function (result) {
    return result.deletedCount;
  });
};
