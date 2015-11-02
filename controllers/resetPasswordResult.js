"use strict";
var Component = require("./component");
var ctlLogin = require("./login");
var view = require("./resetPasswordResult.html");
var page = require("../scripts/page");

function ResetPasswordResult(containerID) {
  Component.call(this, view, containerID);
  global.clickResetPasswordResultGoToLogin = this.goToLogin.bind(this);
}
ResetPasswordResult.prototype = new Component();
ResetPasswordResult.prototype.goToLogin = function () {
  page.setURL("/login");
  global.viewInitial();
};

module.exports = ResetPasswordResult;
