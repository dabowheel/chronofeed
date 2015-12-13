"use strict";
let users = require("../mongodb/users");
let verify = require("../mongodb/verify");
let verifyEmail = require("../server/verifyEmail");
let config = require("../server/config");

exports.signup = function (req,res,next) {  
  users.signup(req.db, req.body.username, req.body.email, req.body.password).then(function (signupResult) {
    req.session.userID = signupResult._id;
    req.session.username = signupResult.username;

    return verify.startVerify(req.db, req.session.userID, req.body.email).then(function (verifyResult) {
      return verifyEmail.sendEmailVerification(req.hostname, req.body.email, config.CF_EMAIL_FROM, verifyResult.hash, verifyResult.code).then(function (resultText) {
        console.log(resultText);
        res.json({
          username: signupResult.username
        });
      });
    });
  }).catch(function (err) {
    next(err);
  });
};

exports.login = function (req,res,next) {
  users.login(req.db, req.body.username, req.body.password).then(function (result) {
    req.session.userID = result._id;
    req.session.username = result.username;
    delete result._id;
    res.json(result);
  }).catch(function (err) {
    next(err);
  });
};

exports.logout = function (req,res,next) {
  delete req.session.userID;
  delete req.session.username;
  res.end();
};
