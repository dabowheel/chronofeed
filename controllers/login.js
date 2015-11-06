"use strict";
var view = require("./login.html");
var datastore = require("../scripts/datastore");
var validate = require("../scripts/validate");
var Component = require("./component");
import route from "./route";

class Login extends Component {
  constructor(containerID) {
    super(containerID, "Grackle | Login");
    this.global();
  }
  render(callback) {
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
        global.component.All.username = res.username;
        route("/");
      } else {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html("Invalid username or password. ");
      }
    }.bind(this));
  }
  clickForgotPasswordLink() {
    route("/forgotPassword");
  }
  clickSignupLink() {
    route("/signup");
  }
}

module.exports = Login;
