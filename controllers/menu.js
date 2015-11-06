"use strict";
var datastore = require("../scripts/datastore");
var Component = require("./component");
var view = require("./menu.html");
import route from "./route";

class Menu extends Component {
  constructor(containerID,isProfile,isAdmin) {
    super(containerID);
    this.isProfile = isProfile;
    this.isAdmin = isAdmin;
    this.global();
  }
  render(callback) {
    let template = Handlebars.compile(view);
    callback(null, template(this));
  }
  clickBlogList() {
    route("/");
  }
  clickProfile() {
    route("/profile");
  }
  clickAdmin() {
    route("/admin");
  }
  clickLogout() {
    datastore("GET","logout",null, function(err,res) {
      if (err) {
        $("#menuPlaceForAlert").addClass("alert alert-warning");
        $("#menuPlaceForAlert").html(err);
        return;
      }

      global.clearComponents();
      route("/");
    });
  }
}

module.exports = Menu;
