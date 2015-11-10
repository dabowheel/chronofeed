"use strict";
var validate = require("../scripts/validate");
var Component = require("./component");
var datastore = require("../scripts/datastore");
var view = require("./resetPassword.html");
import route from "./route";
var sha256 = require("../vendor/sha256");

class ResetPassword extends Component {
  constructor(containerID,hash,code) {
    super(containerID, "Grackle | ResetPassword");
    this.hash = hash;
    this.code = code;
    this.global();
  }
  render(callback) {
    document.title = "Grackle | Reset Password";
    callback(null, view);
  }
  afterLoad() {
    document.getElementById("inputPassword").focus();
    validate.listenToFields(["inputPassword"], "submitButton");
    validate.addReturnPressListener(["inputPassword"], this.submit.bind(this));
  }
  getValues() {
    return {
      password: sha256.hash(this.getPasswordPlain())
    };
  }
  getPasswordPlain() {
    return document.getElementById("inputPassword").value;
  }
  validate(values,passwordPlain) {
    var valid = true;

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
  submit() {
    var values = this.getValues();
    if (!this.validate(values, this.getPasswordPlain())) {
      return;
    }

    values.hash = this.hash;
    values.code = this.code;
    datastore("POST", "resetPassword", values, function (err,res) {
      if (err) {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
        return;
      }

      route("/resetPasswordResult");
    });
  }
}

module.exports = ResetPassword;
