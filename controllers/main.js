var ctlLogin = require("./login");
var ctlSignup = require("./signup");
var ctlAdmin = require("./admin");
var ctlSplash = require("./splash");
var ctlBlogList = require("./blogList");
var ctlBlog = require("./blog");
var ctlMenu = require("./menu");
var ctlProfile = require("./profile");
var ctlVerifyEmail = require("./verifyEmail");
var views = require("../scripts/views");
var datastore = require("../scripts/datastore");

global.clearCache = function() {
  global.cache = {};
  global.cache.blogs = {};
};
global.clearCache();

window.onpopstate = function (e) {
  viewInitial();
};

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
        ctlAdmin.viewAdmin();
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
      } else {
        ctlSplash.viewSplash();
      }
    }
  });
}

window.onhashchange = function () {
  viewInitial();
};

function loadAssetsFromServer(callback) {
  var promiseList = [];
  var names = ["admin","blog","blogList","login","menu","profile","signup","splash","verifyEmail"];
  for (var name of names) {
    promiseList[promiseList.length] = views.getTemplateSource(name);
  }

  var p = Promise.all(promiseList);
  p.then(function (val) {
    callback();
  });
}

global.loadAll = loadAll;
global.viewInitial = viewInitial;

ctlLogin.setGlobals();
ctlMenu.setGlobals();
ctlSignup.setGlobals();
ctlAdmin.setGlobals();
ctlBlogList.setGlobals();
ctlProfile.setGlobals();
ctlBlog.setGlobals();
ctlSplash.setGlobals();
ctlVerifyEmail.setGlobals();
