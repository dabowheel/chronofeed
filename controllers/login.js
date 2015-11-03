"use strict";
var view = require("./login.html");
var datastore = require("../scripts/datastore");
var ctlBlogList = require("./blogList");
var page = require("../scripts/page");
var validate = require("../scripts/validate");

function viewLogin() {
  page.setURL("/login","Grackle | Login");
  document.getElementById("main").innerHTML = view;
  function onKeypress (e) {
    if (e.keyCode == 13) {
      clickLogin();
    }
  }
  document.getElementById("inputUsername").onkeypress = onKeypress;
  document.getElementById("inputPassword").onkeypress = onKeypress;
  document.getElementById("inputUsername").focus();

  validate.listenToFields(["inputUsername", "inputPassword"], "loginButton");
}

function getLoginFormValues() {
  return {
    username: document.getElementById("inputUsername").value,
    password: CryptoJS.SHA256(document.getElementById("inputPassword").value).toString()
  };
}

function getPasswordPlain() {
  return document.getElementById("inputPassword").value;
}

function validateLoginForm(values,passwordPlain) {
  var valid = true;

  if (values.username === "") {
    $("#inputUsernameFormGroup").addClass("has-error");
    valid = false;
  } else {
    $("#inputUsernameFormGroup").removeClass("has-error");
  }

  if (passwordPlain === "") {
    $("#inputPasswordFormGroup").addClass("has-error");
    valid = false;
  } else {
    $("#inputPasswordFormGroup").removeClass("has-error");
  }

  return valid;
}

function clickLogin() {
  var values = getLoginFormValues();
  if (!validateLoginForm(values, getPasswordPlain())) {
    return;
  }

  datastore("POST", "login", values, function (err,res) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }
    if (res.success) {
      cache.username = res.username;
      ctlBlogList.viewBlogList();
    } else {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html("Invalid username or password. ");
    }
  });
}

function clickForgotPasswordLink() {
  page.setURL("/forgotPassword");
  global.viewInitial();
}

exports.viewLogin = viewLogin;
exports.setGlobals = function () {
  global.clickLogin = clickLogin;
  global.clickForgotPasswordLink = clickForgotPasswordLink;
};
