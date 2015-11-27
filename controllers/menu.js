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
  setLogLink(title,inDesigner) {
    if (title) {
      let logLink = document.getElementById("logLink");
      let link;
      if (logLink.firstChild) {
        link = logLink.firstChild;
      } else {
        link = document.createElement("a");
      }
      let url = "/log/" + title + "/";
      link.setAttribute("href",url);
      link.onclick = function () {
        route(url);
        return false;
      };
      link.textContent = title;
      if (!logLink.firstChild) {
        logLink.appendChild(link);
      }
      if (!inDesigner) {
        logLink.classList.add("active");
        let configLink = document.getElementById("configLink");
        while (configLink.firstChild) {
          configLink.removeChild(configLink.firstChild);
        }
      } else {
        let configLink = document.getElementById("configLink");
        let link;
        if (configLink.firstChild) {
          link = configLink.firstChild;
        } else {
          link = document.createElement("a");
        }
        let url = "/log/" + title + "/designer/";
        link.setAttribute("href",url);
        link.onclick = function () {
          route(url);
          return false;
        };
        link.textContent = "Designer";
        if (!configLink.firstChild) {
          configLink.appendChild(link);
        }
        configLink.classList.add("active");
      }
    } else {
      let configLink = document.getElementById("configLink");
      while(configLink.firstChild) {
        configLink.removeChild(configLink.firstChild);
      }
      let logLink = document.getElementById("logLink");
      while(logLink.firstChild) {
        logLink.removeChild(logLink.firstChild);
      }
    }
  }
}

module.exports = Menu;
