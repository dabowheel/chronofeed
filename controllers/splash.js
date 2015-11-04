"use strict";
var view = require("./splash.html");
var page = require("../scripts/page");
var Component = require("./component");

class Splash extends Component {
  constructor(containerID) {
    super(containerID);
    this.global();
  }
  render(callback) {
    callback(null, view);
  }
  afterLoad() {
    page.setURL("/", "Grackle");
  }
  clickSignup() {
    page.setURL("/signup");
    global.viewInitial();
  }
  clickLogin() {
    page.setURL("/login");
    global.viewInitial();
  }
}

module.exports = Splash;
