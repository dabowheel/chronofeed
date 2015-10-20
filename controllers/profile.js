var views = require("../scripts/views");
var datastore = require("../scripts/datastore");
var modelData = require("../model/data");

function getProfile(callback) {
  if (modelData.profile) {
    callback(null, modelData.profile);
    return;
  }

  datastore("GET", "getProfile", null, function (err,res) {
    if (err) {
      return callback(err, null);
    }
    callback(null, res);
  });
}

function displayProfile(profile) {
  var template = Handlebars.compile(views.list.menu);
  var menuHTML = template({
    username: modelData.username,
    isProfile: true
  });
  template = Handlebars.compile(views.list.profile);
  var profileHTML = template(profile);
  document.getElementById("main").innerHTML = menuHTML + profileHTML;
}

function viewProfile() {
  getProfile(function (err, res) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      displayProfile({});
      return;
    }
    displayProfile(res);
  });
}

function clickSaveProfile() {

}

exports.viewProfile = viewProfile;
exports.setGlobals = function () {
  global.clickSaveProfile = clickSaveProfile;
};
