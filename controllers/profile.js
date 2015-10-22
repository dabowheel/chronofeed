var views = require("../scripts/views");
var datastore = require("../scripts/datastore");
var modelData = require("../model/data");
var page = require("../scripts/page");

function getProfile(callback) {
  if (modelData.profile) {
    callback();
    return;
  }

  datastore("GET", "getProfile", null, function (err,res) {
    if (err) {
      return callback(err);
    }
    modelData.profile = res;
    callback();
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
  getProfile(function (err) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      displayProfile({});
      return;
    }

    page.setURL("/profile");
    displayProfile(modelData.profile);
  });
}

function getPasswordPlain() {
  return document.getElementById("inputPassword").value;
}

function getValues() {
  return {
    username: modelData.profile.username,
    email: document.getElementById("inputEmail").value,
    password: getPasswordPlain().length > 0 ? CryptoJS.SHA256(getPasswordPlain()).toString() : modelData.profile.password
  };
}

function validate(values, passwordPlain) {
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
  if (!validate(values, getPasswordPlain())) {
    return;
  }

  datastore("POST", "saveProfile", values, function (err,res) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    modelData.profile = values;
    $("#placeForAlert").removeClass("alert alert-warning");
    $("#placeForAlert").addClass("alert alert-success");
    $("#placeForAlert").html("Saved");
  });
}

exports.viewProfile = viewProfile;
exports.setGlobals = function () {
  global.clickSaveProfile = clickSaveProfile;
};
