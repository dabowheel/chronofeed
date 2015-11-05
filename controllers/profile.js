"use strict";
var view = require("./profile.html");
var Menu = require("./menu");
var datastore = require("../scripts/datastore");
var page = require("../scripts/page");
var validate = require("../scripts/validate");
var modelUserList = require("../model/userList");

function getProfile(callback) {
  if (global.component.All.profile) {
    callback();
    return;
  }

  datastore("GET", "getProfile", null, function (err,res) {
    if (err) {
      return callback(err);
    }
    var user = new modelUserList.User();
    user.loadObject(res);
    global.component.All.profile = user;
    callback();
  });
}

function displayProfile(profile) {
  let menu = new Menu("", true, false);
  menu.render(function (err, menuView) {
    let template = Handlebars.compile(view);
    var profileHTML = template(profile);
    document.getElementById("main").innerHTML = menuView + profileHTML;

    validate.listenToFields(["inputEmail"], "saveButton");
    validate.addReturnPressListener(["inputEmail", "inputPassword"], clickSaveProfile);
  });
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
    displayProfile(global.component.All.profile);
  });
}

function getPasswordPlain() {
  return document.getElementById("inputPassword").value;
}

function getValues() {
  return {
    email: document.getElementById("inputEmail").value,
    password: getPasswordPlain().length > 0 ? CryptoJS.SHA256(getPasswordPlain()).toString() : global.component.All.profile.password
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

    for (let name in values) {
      global.component.All.profile[name] = values[name];
    }
    let message;
    if (res.checkEmail) {
      global.component.All.profile.emailVerified = false;
      displayProfile(global.component.All.profile);
      message = "Saved. Check your email for a message to verify your email address.";
    } else {
      message = "Saved.";
    }
    $("#placeForAlert").removeClass("alert alert-warning");
    $("#placeForAlert").addClass("alert alert-success");
    $("#placeForAlert").html(message);
  });
}

global.clickResendVerification = function () {
  datastore("GET", "resendVerification", null, function (err,obj) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    $("#placeForAlert").removeClass("alert-warning");
    $("#placeForAlert").addClass("alert alert-success");
    $("#placeForAlert").html("A verfication message was sent to your email address. Check your email to verify that you recieved it.");
  });
};

exports.viewProfile = viewProfile;
exports.setGlobals = function () {
  global.clickSaveProfile = clickSaveProfile;
};
