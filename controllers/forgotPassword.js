"use strict";
var view = require("./forgotPassword.html");
var page = require("../scripts/page");
var validate = require("../scripts/validate");
var datastore = require("../scripts/datastore");
var ForgotPasswordResult = require("./forgotPasswordResult");

function viewForgotPassword() {
  page.setURL("/forgotPassword","Grackle | Forgot Password");
  document.getElementById("main").innerHTML = view;
  document.getElementById("inputUsername").focus();
  validate.listenToFields(["inputUsername"], "resetButton");
  validate.addReturnPressListener(["inputUsername"], clickResetPassword);
}

function clickResetPassword() {
  var username = document.getElementById("inputUsername").value;
  if (username === "") {
    $("#inputUsernameFormGroup").addClass("has-error");
    return;
  }

  var obj = {
    username: username
  };
  datastore("POST","forgotPassword", obj, function (err,res) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    var c = new ForgotPasswordResult("main");
    c.show();
  });
}

exports.viewForgotPassword = viewForgotPassword;
exports.setGlobals = function () {
  global.clickResetPassword = clickResetPassword;
};
