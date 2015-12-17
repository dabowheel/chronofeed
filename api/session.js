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

exports.getProfile = function (req,res,next) {
  if (!req.session.userID) {
    return next(new Error("user not logged in"));
  }
  
  users.getProfile(req.db, req.session.userID).then((result) => {
    res.json(result);
  }).catch((err) => {
    next(err);
  });
};

exports.updateProfile = function (req,res,next) {
  if (!req.session.userID) {
    return next(new Error("user not logged in"));
  }

  users.updateProfile(req.db, req.session.userID, req.body).then((result) => {
    let p;
    if (result.checkEmail) {
      p = verify.startVerify(req.db, req.session.userID, req.body.email).then(function (verifyResult) {
        return verifyEmail.sendEmailVerification(req.hostname, req.body.email, config.CF_EMAIL_FROM, verifyResult.hash, verifyResult.code).then(function (resultText) {
          console.log(resultText);
        });
      });
    } else {
      p = Promise.resolve();
    }
    return p.then(function () {
      res.json(result);      
    });
  }).catch((err) => {
    next(err);
  });
};

exports.logout = function (req,res,next) {
  delete req.session.userID;
  delete req.session.username;
  res.end();
};
