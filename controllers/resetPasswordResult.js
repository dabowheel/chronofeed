"use strict";
var Component = require("./component");
var ctlLogin = require("./login");
var view = require("./resetPasswordResult.html");
var page = require("../scripts/page");

class ResetPasswordResult extends Component {
  constructor(containerID) {
    super(containerID);
    this.global();
  }
  render(callback) {
    callback(null, view);
  }
  goToLogin() {
    page.setURL("/login");
    global.viewInitial();
  }
}

module.exports = ResetPasswordResult;
