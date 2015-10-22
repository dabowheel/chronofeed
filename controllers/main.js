var ctlLogin = require("./login");
var ctlSignup = require("./signup");
var ctlAdmin = require("./admin");
var ctlSplash = require("./splash");
var ctlBlogList = require("./blogList");
var ctlBlog = require("./blog");
var ctlMenu = require("./menu");
var ctlProfile = require("./profile");
var views = require("../scripts/views");
var datastore = require("../scripts/datastore");
var modelData = require("../model/data");

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
  } else {
    datastore("GET", "session", null, function (err,res) {
      if (err) {
        if (location.hash) {
          history.pushState("", document.title, window.location.pathname + window.location.search);
        }
        ctlSplash.viewSplash();
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
        return;
      }

      if (!res.username) {
        ctlSplash.viewSplash();
        return;
      }

      modelData.username = res.username;
      if (location.hash == "#admin") {
        ctlAdmin.viewAdmin();
      } else if (location.hash == "#profile") {
        ctlProfile.viewProfile();
      } else {
        if (location.hash) {
          history.pushState("", document.title, window.location.pathname + window.location.search);
        }
        ctlBlogList.viewBlogList();
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
ctlBlog.setGlobals();
