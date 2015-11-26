"use strict";
var view = require("./signup.html");
var datastore = require("../scripts/datastore");
var validate = require("../scripts/validate");
var Component = require("./component");
import route from "./route";
var sha256 = require("../vendor/sha256");

class Signup extends Component {
  constructor(containerID) {
    super(containerID, "ChronoFeed | Signup");
    this.global();
  }
  render(callback) {
    callback(null, view);
  }
  afterLoad() {
    document.getElementById("inputUsername").focus();
    validate.addReturnPressListener(["inputUsername", "inputEmail", "inputPassword"], this.clickSignup.bind(this));
    validate.listenToFields(["inputUsername", "inputEmail", "inputPassword"], "signupButton");
  }
  getSignupFormValues() {
    return {
      username: document.getElementById("inputUsername").value,
      email: document.getElementById("inputEmail").value,
      password: sha256.hash(this.getPasswordPlain())
    };
  }
  getPasswordPlain() {
    return document.getElementById("inputPassword").value;
  }
  validateSignupForm(values,passwordPlain) {
    var valid = true;

    if (values.username === "") {
      $("#inputUsernameFormGroup").addClass("has-error");
      valid = false;
    } else {
      $("#inputUsernameFormGroup").removeClass("has-error");
    }

    if (values.email === "") {
      $("#inputEmailFormGroup").addClass("has-error");
      valid = false;
    } else {
      $("#inputEmailFormGroup").removeClass("has-error");
    }

    if (passwordPlain === "") {
      $("#inputPasswordFormGroup").addClass("has-error");
      valid = false;
    } else if (passwordPlain.length < 8) {
      $("#inputPasswordFormGroup").addClass("has-error");
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html("Password length must be at least 8 characters.");
      valid = false;
    } else {
      $("#inputPasswordFormGroup").removeClass("has-error");
      $("#placeForAlert").removeClass("alert alert-warning");
      $("#placeForAlert").html("");
    }

    return valid;
  }
  clickLoginLink() {
    route("/login");
  }
  clickSignup() {
    var values = this.getSignupFormValues();

    if (!this.validateSignupForm(values, this.getPasswordPlain())) {
      return;
    }

    datastore("POST","signup",values,function (err,res) {
      if (err) {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
      } else {
        global.component.All.username = res.username;
        route("/");
      }
    });
  }
}

module.exports = Signup;
