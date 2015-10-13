var datastore = require("../scripts/datastore");
var blogList = require("./blogList_ctl");
var splash = require("./splash_ctl");

function clickBlogList() {
  history.pushState("", document.title, window.location.pathname + window.location.search);
  blogList.viewBlogList();
}

function clickLogout() {
  datastore("GET","logout",null, function(err,res) {
    if (err) {
      $("#menuPlaceForAlert").addClass("alert alert-warning");
      $("#menuPlaceForAlert").html(err);
      return;
    }

    history.pushState("", document.title, window.location.pathname + window.location.search);
    splash.viewSplash();
  });
}

exports.setGlobals = function () {
  global.clickBlogList = clickBlogList
  global.clickLogout = clickLogout;
}
