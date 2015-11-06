"use strict";
var view = require("./profile.html");
var Menu = require("./menu");
var datastore = require("../scripts/datastore");
var validate = require("../scripts/validate");
var modelUserList = require("../model/userList");
var Component = require("./component");
var LoadError = require("./loadError");

class Profile extends Component {
  constructor(containerID) {
    super(containerID, "Grackle | Profile");
    this.global();
  }
  getProfile(callback) {
    if (this.profile) {
      callback();
      return;
    }

    datastore("GET", "getProfile", null, function (err,res) {
      if (err) {
        return callback(err);
      }
      var user = new modelUserList.User();
      user.loadObject(res);
      this.profile = user;
      callback();
    }.bind(this));
  }
  render(callback) {
    this.getProfile(function (err) {
      if (err) {
        let c = new LoadError(this.containerID, "Profile", err);
        return callback(err, c);
      }

      let menu = new Menu("", true, false);
      menu.render(function (err, menuView) {
        let template = Handlebars.compile(view);
        var profileHTML = template(this.profile);
        callback(null, menuView + profileHTML);
      }.bind(this));
    }.bind(this));
  }
  afterLoad() {
    document.title = "Grackle | Profile";
    validate.listenToFields(["inputEmail"], "saveButton");
    validate.addReturnPressListener(["inputEmail", "inputPassword"], this.clickSave.bind(this));
  }
  getPasswordPlain() {
    return document.getElementById("inputPassword").value;
  }
  getValues() {
    return {
      email: document.getElementById("inputEmail").value,
      password: this.getPasswordPlain().length > 0 ? CryptoJS.SHA256(this.getPasswordPlain()).toString() : this.profile.password
    };
  }
  validateProfileForm(values, passwordPlain) {
    var valid = true;

    if (values.email === "") {
      $("#inputEmailFormGroup").addClass("has-error");
      valid = false;
    } else {
      $("#inputEmailFormGroup").removeClass("has-error");
    }

    if (passwordPlain.length > 0 && passwordPlain.length < 8) {
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
  clickSave() {
    var values = this.getValues();
    if (!this.validateProfileForm(values, this.getPasswordPlain())) {
      return;
    }

    datastore("POST", "saveProfile", values, function (err,res) {
      if (err) {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
        return;
      }

      for (let name in values) {
        this.profile[name] = values[name];
      }
      let message;
      if (res.checkEmail) {
        this.profile.emailVerified = false;
        this.show();
        message = "Saved. Check your email for a message to verify your email address.";
      } else {
        message = "Saved.";
      }
      $("#placeForAlert").removeClass("alert alert-warning");
      $("#placeForAlert").addClass("alert alert-success");
      $("#placeForAlert").html(message);
    }.bind(this));
  }
  clickResendVerification() {
    datastore("GET", "resendVerification", null, function (err,obj) {
      if (err) {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
        return;
      }

      $("#placeForAlert").removeClass("alert-warning");
      $("#placeForAlert").addClass("alert alert-success");
      $("#placeForAlert").html("A verfication message was sent to your email address. Check your email to verify that you recieved it.");
    });
  }
}

module.exports = Profile;
