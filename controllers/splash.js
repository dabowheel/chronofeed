var views = require("../scripts/views");
var ctlLogin = require("./login");
var ctlSignup = require("./signup");
var page = require("../scripts/page");

function viewSplash() {
  page.setURL("/", "Grackle");
  document.getElementById("main").innerHTML = views.list.splash;
}

function clickViewSignup() {
  ctlSignup.viewSignup();
}

function clickViewLogin() {
  ctlLogin.viewLogin();
}

exports.viewSplash = viewSplash;
exports.setGlobals = function () {
  global.clickViewSignup = clickViewSignup;
  global.clickViewLogin = clickViewLogin;
};
