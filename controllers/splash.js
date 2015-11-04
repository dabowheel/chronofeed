"use strict";
var view = require("./splash.html");
var ctlSignup = require("./signup");
var page = require("../scripts/page");

function viewSplash() {
  page.setURL("/", "Grackle");
  document.getElementById("main").innerHTML = view;
}

function clickViewSignup() {
  ctlSignup.viewSignup();
}

function clickViewLogin() {
  page.setURL("/login");
  global.viewInitial();
}

exports.viewSplash = viewSplash;
exports.setGlobals = function () {
  global.clickViewSignup = clickViewSignup;
  global.clickViewLogin = clickViewLogin;
};
