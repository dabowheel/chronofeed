"use strict";
var Component = require("./component");
var view = require("./forgotPasswordResult.html");

class ForgotPasswordResult extends Component {
  constructor(containerID) {
    super(containerID, "ChronoFeed | Forgot Password Result");
  }
  render(callback) {
    callback(null, view);
  }
}

module.exports = ForgotPasswordResult;
