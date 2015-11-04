"use strict";
var datastore = require("../scripts/datastore");
var ctlBlogList = require("./blogList");
var ctlSplash = require("./splash");
var ctlProfile = require("./profile");
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
    ctlBlogList.viewBlogList();
  }
  clickProfile() {
    ctlProfile.viewProfile();
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

      clearCache();
      history.pushState("", document.title, window.location.pathname + window.location.search);
      ctlSplash.viewSplash();
    });
  }
}

module.exports = Menu;
