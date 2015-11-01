"use strict";
var Component = require("./component");
var ctlLogin = require("./login");
var view = require("../public/views/resetPasswordResult.html");
var page = require("../scripts/page");

function ResetPasswordResult(notUsed,containerID) {
  Component.call(this, view, containerID);
  global.clickResetPasswordResultGoToLogin = this.goToLogin.bind(this);
}
ResetPasswordResult.prototype = new Component();
ResetPasswordResult.prototype.goToLogin = function () {
  page.setURL("/login");
  global.viewInitial();
};

module.exports = ResetPasswordResult;
