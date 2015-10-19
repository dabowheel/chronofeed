var ctlLogin = require("./login_ctl.js");
var ctlSignup = require("./signup_ctl.js");
var ctlAdmin = require("./admin_ctl.js");
var ctlSplash = require("./splash_ctl.js");
var ctlBlogList = require("./blogList_ctl.js");
var views = require("../scripts/views");
var datastore = require("../scripts/datastore");
var ctlMenu = require("./menu_ctl");

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
ctlLogin.setGlobals();
ctlMenu.setGlobals();
ctlSignup.setGlobals();
ctlAdmin.setGlobals();
ctlBlogList.setGlobals();
