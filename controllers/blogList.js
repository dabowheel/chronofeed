"use strict";
var view = require("./blogList.html");
var Menu = require("./menu");
var datastore = require("../scripts/datastore");
var modelBlogList = require("../model/blogList");
var modelBlog = require("../model/blog");
var Component = require("./component");
var LoadError = require("./loadError");
import route from "./route";

class ctlBlogList extends Component {
  constructor(containerID) {
    super(containerID, "Grackle");
    this.global();
  }
  getBlogList(callback) {
    if (this.blogList) {
      return callback();
    }

    datastore("GET","BlogList",null,function (err,res) {
      if (err) {
        return callback(err);
      }

      this.blogList = new modelBlogList.BlogList();
      this.blogList.loadObject(res);
      this.blogList.sort();
      callback();
    }.bind(this));
  }
  render(callback) {
    this.getBlogList(function (err) {
      if (err) {
        let c = new LoadError(this.container, "", err);
        return callback(err, c);
      }

      let menu = new Menu("", false, false);
      menu.render(function (err, menuView) {
        let template = Handlebars.compile(view);
        var blogListHTML = template(this.blogList);
        callback(null, menuView + blogListHTML);
      }.bind(this));
    }.bind(this));
  }
  addBlog() {
    var blogInfo = new modelBlog.BlogInfo(0, this.blogList.getNewTitle(), this.blogList.getDOMID());
    this.blogList.add(blogInfo);
    this.blogList.sort();
    this.show();
    datastore("PUT", "Blog", blogInfo.exportObject(), function (err,res) {
      if (err) {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
        return;
      }

      blogInfo._id = res._id;
    });
  }
  editBlog(domID) {
    var blogInfo = this.blogList.getBlogInfo(domID);
    route("/blog/" + blogInfo.title);
  }
  confirmDeleteBlog(domID) {
    var blogInfo = this.blogList.getBlogInfo(domID);
    $("#deleteHeader").html("Delete " + blogInfo.title);
    document.getElementById("deleteButton").onclick = function () {
      this.deleteBlog(domID);
    }.bind(this);
    $("#deleteModal").modal("show");
  }
  deleteBlog(domID) {
    var blogInfo = this.blogList.delete(domID);
    this.show();
    datastore("DELETE", "Blog/" + blogInfo.title, blogInfo.exportObject(), function(err,res) {
      if (err) {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
        return;
      }
    });
  }
}

module.exports = ctlBlogList;
