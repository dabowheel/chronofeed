"use strict";
var datastore = require("../scripts/datastore");
var page = require("../scripts/page");
var Component = require("./component");
var view = require("./menu.html");

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
    page.setURL("/");
    global.viewInitial();
  }
  clickProfile() {
    page.setURL("/profile");
    global.viewInitial();
  }
  clickAdmin() {
    console.log("click admin");
    page.setURL("/admin");
    global.viewInitial();
  }
  clickLogout() {
    datastore("GET","logout",null, function(err,res) {
      if (err) {
        $("#menuPlaceForAlert").addClass("alert alert-warning");
        $("#menuPlaceForAlert").html(err);
        return;
      }

      global.clearComponents();
      page.setURL("/");
      global.viewInitial();
    });
  }
}

module.exports = Menu;
