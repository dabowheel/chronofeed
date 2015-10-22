var datastore = require("../scripts/datastore");
var ctlBlogList = require("./blogList");
var ctlSplash = require("./splash");
var ctlProfile = require("./profile");
var modelData = require("../model/data");
var ctlAdmin = require("./admin");

function clickBlogList() {
  ctlBlogList.viewBlogList();
}

function clickProfile() {
  ctlProfile.viewProfile();
}

function clickAdmin() {
  ctlAdmin.viewAdmin();
}

function clickLogout() {
  datastore("GET","logout",null, function(err,res) {
    if (err) {
      $("#menuPlaceForAlert").addClass("alert alert-warning");
      $("#menuPlaceForAlert").html(err);
      return;
    }

    modelData.clear();
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
