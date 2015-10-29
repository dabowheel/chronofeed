var views = require("../scripts/views");
var page = require("../scripts/page");
var validate = require("../scripts/validate");
var datastore = require("../scripts/datastore");

function viewForgotPassword() {
  page.setURL("/forgotPassword","Grackle | Forgot Password");
  document.getElementById("main").innerHTML = views.list.forgotPassword;
  document.getElementById("inputUsername").focus();
  validate.listenToFields(["inputUsername"], "resetButton");
  validate.addReturnPressListener(["inputUsername"], clickResetPassword);
}

function clickResetPassword() {
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

    $("#placeForAlert").removeClass("alert-warning");
    $("#placeForAlert").addClass("alert alert-success");
    $("#placeForAlert").html("An email has been sent with a password reset.");
  });
}

exports.viewForgotPassword = viewForgotPassword;
exports.setGlobals = function () {
  global.clickResetPassword = clickResetPassword;
};
