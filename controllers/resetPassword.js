"use strict";
var validate = require("../scripts/validate");
var Component = require("./component");
var datastore = require("../scripts/datastore");
var ResetPasswordResult = require("./resetPasswordResult");
var page = require("../scripts/page");

function ResetPassword(view,containerID,hash,code) {
  Component.call(this, view, containerID);
  this.hash = hash;
  this.code = code;
  global.clickResetPasswordSubmit = this.submit.bind(this);
}
ResetPassword.prototype = new Component();
ResetPassword.prototype.beforeLoad = function () {
  document.title = "Grackle | Reset Password";
};
ResetPassword.prototype.afterLoad = function () {
  document.getElementById("inputPassword").focus();
  validate.listenToFields(["inputPassword"], "submitButton");
  validate.addReturnPressListener(["inputPassword"], global.clickResetPasswordSubmit);
};

ResetPassword.prototype.getValues = function() {
  return {
    password: CryptoJS.SHA256(this.getPasswordPlain()).toString()
  };
};
ResetPassword.prototype.getPasswordPlain = function () {
  return document.getElementById("inputPassword").value;
};

ResetPassword.prototype.validate = function (values,passwordPlain) {
  var valid = true;

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
};

ResetPassword.prototype.submit = function () {
  var values = this.getValues();
  if (!this.validate(values, this.getPasswordPlain())) {
    return;
  }

  values.hash = this.hash;
  values.code = this.code;
  datastore("POST", "resetPassword", values, function (err,res) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    page.setURL("/resetPasswordResult");
    let c = new ResetPasswordResult(null, "main");
    c.show();
  });
};

exports.ResetPassword = ResetPassword;
exports.viewURL = "resetPassword.html";
exports.viewName = "resetPassword";
