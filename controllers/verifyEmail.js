"use strict";
var datastore = require("../scripts/datastore");
var view = require("./verifyEmail.html");
var Component = require("./component");
import route from "./route";

class VerifyEmail extends Component {
  constructor(containerID,hash,code) {
    super(containerID);
    this.hash = hash;
    this.code = code;
    this.global();
  }
  render(callback) {
    datastore("GET","verifyEmail/" + this.hash + "/" + this.code, null, function (err,res) {
      this.error = err;
      callback(null, view);
    }.bind(this));
  }
  alertLoad() {
    if (this.error) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(this.error);
    }
  }
  clickGoHome() {
    route("/");
  }
}

module.exports = VerifyEmail;
