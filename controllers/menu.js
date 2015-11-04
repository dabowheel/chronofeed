"use strict";
var datastore = require("../scripts/datastore");
var ctlBlogList = require("./blogList");
var ctlSplash = require("./splash");
var ctlProfile = require("./profile");
var page = require("../scripts/page");

function clickBlogList() {
  ctlBlogList.viewBlogList();
}

function clickProfile() {
  ctlProfile.viewProfile();
}

function clickAdmin() {
  console.log("click admin");
  page.setURL("/admin");
  global.viewInitial();
}

function clickLogout() {
  datastore("GET","logout",null, function(err,res) {
    if (err) {
      $("#menuPlaceForAlert").addClass("alert alert-warning");
      $("#menuPlaceForAlert").html(err);
      return;
    }

    clearCache();
    history.pushState("", document.title, window.location.pathname + window.location.search);
    ctlSplash.viewSplash();
  });
}

exports.setGlobals = function () {
  global.clickBlogList = clickBlogList;
  global.clickLogout = clickLogout;
  global.clickProfile = clickProfile;
  global.clickAdmin = clickAdmin;
};
