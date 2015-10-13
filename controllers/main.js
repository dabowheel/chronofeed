var login = require("./login_ctl.js");
var signup = require("./signup_ctl.js");
var admin = require("./admin_ctl.js");
var splash = require("./splash_ctl.js");
var blogList = require("./blogList_ctl.js");
var views = require("../scripts/views");
var datastore = require("../scripts/datastore");
var menu = require("./menu_ctl");

function getStack() {
  return (new Error()).stack;
}

function error(message) {
  console.error(message, "\n", getStack());
}

function loadAll() {
  loadAssetsFromServer(function () {
    viewInitial();
  });
}

function viewInitial() {
  if (location.hash == "#login") {
    login.viewLogin();
  } else if (location.hash == "#signup") {
    signup.viewSignup();
  } else if (location.hash == "#admin") {
    admin.viewAdmin();
  } else {
    datastore("GET", "session", null, function (err,res) {
      if (err) {
        error(err);
        splash.viewSplash();
        return;
      }
      if (res.userID) {
        blogList.viewBlogList();
      } else {
        splash.viewSplash();
      }
    });
  }
}

window.onhashchange = function () {
  console.log("hash change")
  viewInitial();
};

function loadAssetsFromServer(callback) {
  var promiseList = [];
  var names = ["admin","blog","blogList","login","menu","signup","splash"];
  for (var i in names) {
    promiseList[promiseList.length] = views.getTemplateSource(names[i]);
  }

  p = Promise.all(promiseList);
  p.then(function (val) {
    callback();
  });
}

global.loadAll = loadAll;
login.setGlobals();
menu.setGlobals();
signup.setGlobals();
