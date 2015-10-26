var views = require("../scripts/views");
var datastore = require("../scripts/datastore");
var page = require("../scripts/page");
var validate = require("../scripts/validate");
var modelUserList = require("../model/userList");

function getProfile(callback) {
  if (cache.profile) {
    callback();
    return;
  }

  datastore("GET", "getProfile", null, function (err,res) {
    if (err) {
      return callback(err);
    }
    var user = new modelUserList.User();
    user.loadObject(res);
    cache.profile = user;
    callback();
  });
}

function displayProfile(profile) {
  var template = Handlebars.compile(views.list.menu);
  var menuHTML = template({
    isProfile: true
  });
  template = Handlebars.compile(views.list.profile);
  var profileHTML = template(profile);
  document.getElementById("main").innerHTML = menuHTML + profileHTML;

  validate.listenToFields(["inputEmail"], "saveButton");
}

function viewProfile() {
  getProfile(function (err) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      displayProfile({});
      return;
    }

    page.setURL("/profile");
    displayProfile(cache.profile);
  });
}

function getPasswordPlain() {
  return document.getElementById("inputPassword").value;
}

function getValues() {
  return {
    username: cache.profile.username,
    email: document.getElementById("inputEmail").value,
    password: getPasswordPlain().length > 0 ? CryptoJS.SHA256(getPasswordPlain()).toString() : cache.profile.password
  };
}

function validateProfileForm(values, passwordPlain) {
  var valid = true;

  if (values.email === "") {
    $("#inputEmailFormGroup").addClass("has-error");
    valid = false;
  } else {
    $("#inputEmailFormGroup").removeClass("has-error");
  }

  if (passwordPlain.length > 0 && passwordPlain.length < 8) {
    $("#inputPasswordFormGroup").addClass("has-error");
    $("#placeForAlert").addClass("alert alert-warning");
    $("#placeForAlert").html("Password length must be at least 8 characters.");
    valid = false;
  } else {
    $("#inputPasswordFormGroup").removeClass("has-error");
    $("#placeForAlert").removeClass("alert alert-warning");
    $("#placeForAlert").html("");
  }

  return valid;
}

function clickSaveProfile() {
  var values = getValues();
  if (!validateProfileForm(values, getPasswordPlain())) {
    return;
  }

  datastore("POST", "saveProfile", values, function (err,res) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    cache.profile = values;
    $("#placeForAlert").removeClass("alert alert-warning");
    $("#placeForAlert").addClass("alert alert-success");
    $("#placeForAlert").html("Saved");
  });
}

exports.viewProfile = viewProfile;
exports.setGlobals = function () {
  global.clickSaveProfile = clickSaveProfile;
};
