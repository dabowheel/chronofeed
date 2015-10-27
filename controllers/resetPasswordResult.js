var Component = require("./Component");
var ctlLogin = require("./login");

function ResetPasswordResult(view,containerID) {
  Component.call(this, view, containerID);
  global.clickResetPasswordResultGoToLogin = this.goToLogin.bind(this);
}

ResetPasswordResult.prototype = new Component();

ResetPasswordResult.prototype.goToLogin = function () {
  ctlLogin.viewLogin();
};

exports.ResetPasswordResult = ResetPasswordResult;
exports.viewURL = "/views/resetPasswordResult.html";
exports.viewName = "resetPasswordResult";
