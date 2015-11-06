"use strict";
var view = require("./forgotPassword.html");
var validate = require("../scripts/validate");
var datastore = require("../scripts/datastore");
var ForgotPasswordResult = require("./forgotPasswordResult");
var Component = require("./component");

class ForgotPassword extends Component {
  constructor (containerID) {
    super(containerID, "Grackle | Forgot Password");
    this.global();
  }
  render(callback) {
    callback(null,view);
  }
  afterLoad() {
    document.getElementById("inputUsername").focus();
    validate.listenToFields(["inputUsername"], "resetButton");
    validate.addReturnPressListener(["inputUsername"], this.clickReset.bind(this));
  }
  clickReset() {
    var username = document.getElementById("inputUsername").value;
    if (username === "") {
      $("#inputUsernameFormGroup").addClass("has-error");
      return;
    }

    var obj = {
      username: username
    };
    datastore("POST","forgotPassword", obj, function (err,res) {
      if (err) {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
        return;
      }

      var c = new ForgotPasswordResult("main");
      c.show();
    });
  }
}

module.exports = ForgotPassword;
