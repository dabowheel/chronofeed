"use strict";
let users = require("../mongodb/users");

exports.deleteUser = function (req,res,next) {
  users.deleteUser(req.db, req.api.id).then(function () {
    res.end();
  }).catch(function (err) {
    next(err);
  });
};
