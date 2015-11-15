"use strict";
var datastore = require("../scripts/datastore");
var Component = require("./component");
var template = require("./menu.hbs");
import route from "./route";

class Menu extends Component {
  constructor(containerID,isProfile,isAdmin,isDesigner,noContainer,navClass) {
    super(containerID);
    this.context = {
      isProfile: isProfile,
      isAdmin: isAdmin,
      isDesigner: isDesigner,
      noContainer: noContainer,
      navClass: navClass
    };
    this.global();
  }
  render(callback) {
    var view = template(this.context);
    callback(null, view);
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
  clickDesigner() {
    route("/designer");
  }
}

module.exports = Menu;
