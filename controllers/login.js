"use strict";
var view = require("./login.html");
var datastore = require("../scripts/datastore");
var page = require("../scripts/page");
var validate = require("../scripts/validate");
var Component = require("./component");

class Login extends Component {
  constructor(containerID) {
    super(containerID);
    this.global();
  }
  render(callback) {
    page.setURL("/login","Grackle | Login");
    callback(null,view);
  }
  afterLoad() {
    validate.addReturnPressListener(["inputUsername", "inputPassword"], this.clickLogin.bind(this));
    validate.listenToFields(["inputUsername", "inputPassword"], "loginButton");
    document.getElementById("inputUsername").focus();
  }
  getLoginFormValues() {
    return {
      username: document.getElementById("inputUsername").value,
      password: CryptoJS.SHA256(document.getElementById("inputPassword").value).toString()
    };
  }
  getPasswordPlain() {
    return document.getElementById("inputPassword").value;
  }
  validateLoginForm(values,passwordPlain) {
    var valid = true;

    if (values.username === "") {
      $("#inputUsernameFormGroup").addClass("has-error");
      valid = false;
    } else {
      $("#inputUsernameFormGroup").removeClass("has-error");
    }

    if (passwordPlain === "") {
      $("#inputPasswordFormGroup").addClass("has-error");
      valid = false;
    } else {
      $("#inputPasswordFormGroup").removeClass("has-error");
    }

    return valid;
  }
  clickLogin() {
    var values = this.getLoginFormValues();
    if (!this.validateLoginForm(values, this.getPasswordPlain())) {
      return;
    }

    datastore("POST", "login", values, function (err,res) {
      if (err) {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
        return;
      }
      if (res.success) {
        this.username = res.username;
        page.setURL("/");
        global.viewInitial();
      } else {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html("Invalid username or password. ");
      }
    }.bind(this));
  }
  clickForgotPasswordLink() {
    page.setURL("/forgotPassword");
    global.viewInitial();
  }
  clickSignupLink() {
    page.setURL("/signup");
    global.viewInitial();
  }
}

module.exports = Login;
