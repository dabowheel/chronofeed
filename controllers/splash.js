"use strict";
var view = require("./splash.html");
var Component = require("./component");
import route from "./route";

class Splash extends Component {
  constructor(containerID) {
    super(containerID, "Grackle");
    this.global();
  }
  render(callback) {
    callback(null, view);
  }
  clickSignup() {
    route("/signup");
  }
  clickLogin() {
    route("/login");
  }
}

module.exports = Splash;
