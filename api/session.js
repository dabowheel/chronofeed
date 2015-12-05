"use strict";
let users = require("../mongodb/users");

exports.signup = function (req,res,next) {
  users.signup(req.db, req.body.username, req.body.email, req.body.password).then(function (result) {
    req.session.userID = result._id;
    res.json({
      username: result.username
    });
  }).catch(function (err) {
    next(err);
  });
};

exports.login = function (req,res,next) {
  users.login(req.db, req.body.username, req.body.password).then(function (result) {
    req.session.userID = result._id;
    delete result._id;
    res.json(result);
  }).catch(function (err) {
    next(err);
  });
};
