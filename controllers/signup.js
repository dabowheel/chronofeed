"use strict";
var view = require("./signup.html");
var datastore = require("../scripts/datastore");
var ctlBlogList = require("./blogList");
var page = require("../scripts/page");
var validate = require("../scripts/validate");

function viewSignup() {
  page.setURL("/signup","Grackle | Signup");
  document.getElementById("main").innerHTML = view;
  document.getElementById("inputUsername").focus();
  function onKeypress(e) {
    if (e.keyCode == 13) {
      clickSignup();
    }
  }
  for (var id of ["inputUsername", "inputEmail", "inputPassword"]) {
    document.getElementById(id).onkeypress = onKeypress;
  }

  validate.listenToFields(["inputUsername", "inputEmail", "inputPassword"], "signupButton");
}

function clickSignup() {
  var values = getSignupFormValues();

  if (!validateSignupForm(values, getPasswordPlain())) {
    return;
  }

  datastore("POST","signup",values,function (err,res) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
    } else {
      cache.username = res.username;
      ctlBlogList.viewBlogList();
    }
  });
}

function getSignupFormValues() {
  return {
    username: document.getElementById("inputUsername").value,
    email: document.getElementById("inputEmail").value,
    password: CryptoJS.SHA256(getPasswordPlain()).toString()
  };
}

function getPasswordPlain() {
  return document.getElementById("inputPassword").value;
}

function validateSignupForm(values,passwordPlain) {
  var valid = true;

  if (values.username === "") {
    $("#inputUsernameFormGroup").addClass("has-error");
    valid = false;
  } else {
    $("#inputUsernameFormGroup").removeClass("has-error");
  }

  if (values.email === "") {
    $("#inputEmailFormGroup").addClass("has-error");
    valid = false;
  } else {
    $("#inputEmailFormGroup").removeClass("has-error");
  }

  if (passwordPlain === "") {
    $("#inputPasswordFormGroup").addClass("has-error");
    valid = false;
  } else if (passwordPlain.length < 8) {
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

exports.viewSignup = viewSignup;
exports.setGlobals = function () {
  global.clickSignup = clickSignup;
};
