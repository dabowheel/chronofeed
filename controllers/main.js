var ctlLogin = require("./login.js");
var ctlSignup = require("./signup.js");
var ctlAdmin = require("./admin.js");
var ctlSplash = require("./splash.js");
var ctlBlogList = require("./blogList.js");
var ctlMenu = require("./menu");
var ctlProfile = require("./profile");
var views = require("../scripts/views");
var datastore = require("../scripts/datastore");

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
    ctlLogin.viewLogin();
  } else if (location.hash == "#signup") {
    ctlSignup.viewSignup();
  } else if (location.hash == "#admin") {
    ctlAdmin.viewAdmin();
  } else if (location.hash == "#profile") {
    ctlProfile.viewProfile();
  } else {
    datastore("GET", "session", null, function (err,res) {
      if (err) {
        error(err);
        ctlSplash.viewSplash();
        return;
      }
      if (res.userID) {
        ctlBlogList.viewBlogList();
      } else {
        ctlSplash.viewSplash();
      }
    });
  }
}

window.onhashchange = function () {
  console.log("hash change");
  viewInitial();
};

function loadAssetsFromServer(callback) {
  var promiseList = [];
  var names = ["admin","blog","blogList","login","menu","profile","signup","splash"];
  for (var name of names) {
    console.log("load", name);
    promiseList[promiseList.length] = views.getTemplateSource(name);
  }

  var p = Promise.all(promiseList);
  p.then(function (val) {
    callback();
  });
}

global.loadAll = loadAll;
ctlLogin.setGlobals();
ctlMenu.setGlobals();
ctlSignup.setGlobals();
ctlAdmin.setGlobals();
ctlBlogList.setGlobals();
ctlProfile.setGlobals();
