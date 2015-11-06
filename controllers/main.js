"use strict";
var Login = require("./login");
var Signup = require("./signup");
var Admin = require("./admin");
var Splash = require("./splash");
var ctlBlogList = require("./blogList");
var ctlBlog = require("./blog");
var Profile = require("./profile");
var VerifyEmail = require("./verifyEmail");
var datastore = require("../scripts/datastore");
var ForgotPassword = require("./forgotPassword");
var ResetPassword = require("./resetPassword");
require("../css/blog.css");
require("babel-polyfill");

global.clearComponents = function() {
  global.component = {};
  global.component.All = {};
  global.component.All.blogs = [];
  global.compPath = {};
};
global.clearComponents();

window.onpopstate = function (e) {
  viewInitial();
};

window.onhashchange = function () {
  viewInitial();
};

function loadAll() {
  if (global.liveReload) {
    global.liveReload();
  }
  viewInitial();
}

function getUsername(callback) {
  if (global.component.All.username) {
    return callback();
  }

  datastore("GET", "session", null, function (err,res) {
    if (err) {
      return callback(err);
    }

    global.component.All.username = res.username;
    callback();
  });
}

function viewInitial() {
  var verifyEmailMatch = location.pathname.match(/^\/verifyEmail\/(.*)\/(.*)$/);
  if (verifyEmailMatch) {
    let c = new VerifyEmail("main", verifyEmailMatch[1], verifyEmailMatch[2]);
    c.show();
    return;
  }

  var resetPasswordMatch = location.pathname.match(/^\/resetPassword\/(.*)\/(.*)$/);
  if (resetPasswordMatch) {
    var p = new ResetPassword("main", resetPasswordMatch[1], resetPasswordMatch[2]);
    p.show();
    return;
  }

  getUsername(function (err) {
    if (err) {
      let c = new Splash("main");
      c.show();
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    if (global.component.All.username) {
      var blogRE = /^\/blog\/(.*)$/;
      if (location.pathname == "/admin") {
        console.log("route to admin");
        let admin = new Admin("main");
        admin.show();
      } else if (location.pathname == "/profile") {
        let c = new Profile("main");
        c.show();
      } else if (location.pathname.match(blogRE)) {
        var title = decodeURI(location.pathname.match(blogRE)[1]);
        let c = new ctlBlog("main", title);
        c.show();
      } else {
        let c = new ctlBlogList("main");
        c.show();
      }
    } else {
      if (location.pathname == "/login") {
        let c = new Login("main");
        c.show();
      } else if (location.pathname == "/signup") {
        let c = new Signup("main");
        c.show();
      } else if (location.pathname == "/forgotPassword") {
        let c = new ForgotPassword("main");
        c.show();
      } else {
        let c = new Splash("main");
        c.show();
      }
    }
  });
}

global.loadAll = loadAll;
global.viewInitial = viewInitial;
