"use strict";
var ctlLogin = require("./login");
var ctlSignup = require("./signup");
var Admin = require("./admin");
var ctlSplash = require("./splash");
var ctlBlogList = require("./blogList");
var ctlBlog = require("./blog");
var ctlMenu = require("./menu");
var ctlProfile = require("./profile");
var ctlVerifyEmail = require("./verifyEmail");
var datastore = require("../scripts/datastore");
var ForgotPassword = require("./forgotPassword");
var ctlResetPassword = require("./resetPassword");
require("babel-polyfill");

global.clearCache = function() {
  global.cache = {};
  global.cache.blogs = {};
};
global.clearCache();

window.onpopstate = function (e) {
  viewInitial();
};

function loadAll() {
  if (global.liveReload) {
    global.liveReload();
  }
  viewInitial();
}

function getUsername(callback) {
  if (cache.username) {
    return callback();
  }

  datastore("GET", "session", null, function (err,res) {
    if (err) {
      return callback(err);
    }

    cache.username = res.username;
    callback();
  });
}

function viewInitial() {
  var verifyEmailMatch = location.pathname.match(/^\/verifyEmail\/(.*)\/(.*)$/);
  if (verifyEmailMatch) {
    ctlVerifyEmail.viewVerifyEmail(verifyEmailMatch[1],verifyEmailMatch[2]);
    return;
  }

  var resetPasswordMatch = location.pathname.match(/^\/resetPassword\/(.*)\/(.*)$/);
  if (resetPasswordMatch) {
    var p = new ctlResetPassword.ResetPassword("main", resetPasswordMatch[1], resetPasswordMatch[2]);
    p.show();
    return;
  }

  getUsername(function (err) {
    if (err) {
      ctlSplash.viewSplash();
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    if (cache.username) {
      var blogRE = /^\/blog\/(.*)$/;
      if (location.pathname == "/admin") {
        console.log("route to admin");
        let admin = new Admin("main");
        admin.show();
      } else if (location.pathname == "/profile") {
        ctlProfile.viewProfile();
      } else if (location.pathname.match(blogRE)) {
        var title = decodeURI(location.pathname.match(blogRE)[1]);
        ctlBlog.viewBlog("",title);
      } else {
        ctlBlogList.viewBlogList();
      }
    } else {
      if (location.pathname == "/login") {
        ctlLogin.viewLogin();
      } else if (location.pathname == "/signup") {
        ctlSignup.viewSignup();
      } else if (location.pathname == "/forgotPassword") {
        let c = new ForgotPassword("main");
        c.show();
      } else {
        ctlSplash.viewSplash();
      }
    }
  });
}

window.onhashchange = function () {
  viewInitial();
};

global.loadAll = loadAll;
global.viewInitial = viewInitial;

ctlLogin.setGlobals();
ctlSignup.setGlobals();
ctlBlogList.setGlobals();
ctlProfile.setGlobals();
ctlBlog.setGlobals();
ctlSplash.setGlobals();
ctlVerifyEmail.setGlobals();
