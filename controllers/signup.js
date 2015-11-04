"use strict";
var view = require("./signup.html");
var datastore = require("../scripts/datastore");
var page = require("../scripts/page");
var validate = require("../scripts/validate");
var Component = require("./component");

class Signup extends Component {
  constructor(containerID) {
    super(containerID);
    this.global();
  }
  render(callback) {
    callback(null, view);
  }
  afterLoad() {
    page.setURL("/signup","Grackle | Signup");
    document.getElementById("inputUsername").focus();
    validate.addReturnPressListener(["inputUsername", "inputEmail", "inputPassword"], this.clickSignup.bind(this));
    validate.listenToFields(["inputUsername", "inputEmail", "inputPassword"], "signupButton");
  }
  getSignupFormValues() {
    return {
      username: document.getElementById("inputUsername").value,
      email: document.getElementById("inputEmail").value,
      password: CryptoJS.SHA256(this.getPasswordPlain()).toString()
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
    page.setURL("/login");
    global.viewInitial();
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
        page.setURL("/");
        global.viewInitial();
      }
    });
  }
}

module.exports = Signup;
