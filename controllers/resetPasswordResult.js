"use strict";
var Component = require("./component");
var ctlLogin = require("./login");
var view = require("./resetPasswordResult.html");
import route from "./route";

class ResetPasswordResult extends Component {
  constructor(containerID) {
    super(containerID);
    this.global();
  }
  render(callback) {
    callback(null, view);
  }
  goToLogin() {
    route("/login");
  }
}

module.exports = ResetPasswordResult;
