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

window.onpopstate = function (e) {
  console.log("popstate");
  viewInitial();
};

function getStack() {
  return (new Error()).stack;
}

function error(message) {
  console.error(message, "\n", getStack());
}

function loadAll() {
  console.log("loadAll");
  loadAssetsFromServer(function () {
    viewInitial();
  });
}

function getUsername(callback) {
  if (modelData.username) {
    return callback();
  }

  datastore("GET", "session", null, function (err,res) {
    if (err) {
      return callback(err);
    }

    modelData.username = res.username;
    callback();
  });
}

function viewInitial() {
  console.log("here");
  getUsername(function (err) {
    console.log("err",err);
    if (err) {
      ctlSplash.viewSplash();
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    if (modelData.username) {
      var blogRE = /^\/blog\/(.*)$/;
      console.log("location.pathname",location.pathname);
      if (location.pathname == "/admin") {
        ctlAdmin.viewAdmin();
      } else if (location.pathname == "/profile") {
        ctlProfile.viewProfile();
      } else if (location.pathname.match(blogRE)) {
        var title = location.pathname.match(blogRE)[1];
        ctlBlog.viewBlog("",title);
      } else {
        ctlBlogList.viewBlogList();
      }
    } else {
      if (location.pathname == "/login") {
        ctlLogin.viewLogin();
      } else if (location.pathname == "/signup") {
        ctlSignup.viewSignup();
      } else {
        ctlSplash.viewSplash();
      }
    }
  });
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
ctlSplash.setGlobals();
