"use strict";
var view = require("./blog.html");
var Menu = require("./menu");
var datastore = require("../scripts/datastore");
var modelBlog = require("../model/blog");
var modelPost = require("../model/post");
var LoadError = require("./loadError");
var validate = require("../scripts/validate");
var Component = require("./component");
import {setURL} from "./route";

class ctlBlog extends Component {
  constructor(containerID,title) {
    super(containerID, "Grackle | " + title);
    this.title = title;
    this.global();
  }
  getBlog(title, callback) {
    if (this.blog) {
      callback();
      return;
    }

    var filter = {
      title: title
    };
    datastore("POST", "readBlog", filter, function (err,res) {
      if (err) {
        return callback(err);
      }

      this.blog = new modelBlog.Blog();
      this.blog.loadObject(res, true);
      callback();
    }.bind(this));
  }
  render(callback) {
    this.getBlog(this.title, function (err) {
      if (err) {
        let c = new LoadError(this.containerID, this.title, err);
        return callback(err, c);
      }

      Handlebars.registerHelper("encodeText", function (str) {
        return str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\n/g,"<br>");
      });

      let menu = new Menu("", false, false);
      menu.render(function (err, menuView) {
        let template = Handlebars.compile(view);
        var blogHTML = template(this.blog);
        callback(null,menuView + blogHTML);
      }.bind(this));
    }.bind(this));
  }
  afterLoad() {
    document.title = "Grackle Blog | " + this.blog.title;
    if (this.blog.editBlogTitle) {
      validate.addReturnPressListener(["inputTitle"], this.saveBlogTitleChange.bind(this));
      validate.listenToFields(["inputTitle"], "blogTitleAcceptButton");
      document.getElementById("inputTitle").select();
    }
  }
  editBlogTitle() {
    this.blog.editBlogTitle = true;
    this.show();
  }
  getBlogTitle() {
    return document.getElementById("inputTitle").value;
  }
  saveBlogTitleChange() {
    var title = this.getBlogTitle();
    if (title === this.blog.title) {
      this.cancelBlogTitleChange();
      return;
    }

    if (title === "") {
      $("#inputTitleFormGroup").addClass("has-error");
      return;
    } else if (global.component.ctlBlogList && global.component.ctlBlogList.blogList.hasTitle(title)) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html("A blog with this title already exists");
      return;
    }

    this.blog.title = title;
    setURL("/blog/" + title, "Grackle | " + title, true);
    if (global.component.ctlBlogList) {
      global.component.ctlBlogList.blogList.updateTitle(this.blog._id, title);
    }
    this.cancelBlogTitleChange();

    var blogInfo = new modelBlog.BlogInfo(this.blog._id, this.blog.title);
    datastore("POST", "saveBlogTitle", blogInfo.exportObject(), function (err, res) {
      if (err) {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
        return;
      }
    });
  }
  cancelBlogTitleChange() {
    $("#placeForAlert").removeClass("alert alert-warning");
    $("#placeForAlert").html("");
    this.blog.editBlogTitle = false;
    this.show();
  }
  addPost() {
    var domID = this.blog.getDOMID();
    this.blog.addPost(new modelPost.Post("", "", "", new Date(), this.blog._id, domID));
    this.blog.editPost(domID);
    this.show();
    document.getElementById("posttitle").select();
  }
  getPost() {
    var dateOnly = document.getElementById("postdateonly").value;
    var timeOnly = document.getElementById("posttimeonly").value;
    var date = new Date(dateOnly + " " + timeOnly);
    return {
      _id: document.getElementById("postpostid").value,
      title: document.getElementById("posttitle").value,
      text: document.getElementById("posttext").value,
      date: date,
      blogID: document.getElementById("postblogid").value,
      dateOnly: dateOnly,
      timeOnly: timeOnly,
      domID: document.getElementById("postdomid").value
    };
  }
  savePostChanges(domID) {
    var values = this.getPost();
    var post = new modelPost.Post(values._id, values.title, values.text, values.date, values.blogID, values.domID);
    this.blog.stopEditingPost(domID);
    if (post._id) {
      this.blog.savePost(domID,post);
      this.show();
      datastore("POST", "updatePost", post.exportObject(), function (err,res) {
        if (err) {
          $("#placeForAlert").addClass("alert alert-warning");
          $("#placeForAlert").html(err);
          return;
        }
      });
    } else {
      this.blog.savePost(domID,post);
      this.show();
      datastore("POST", "createPost", post.exportObject(), function (err,res) {
        if (err) {
          $("#placeForAlert").addClass("alert alert-warning");
          $("#placeForAlert").html(err);
          return;
        }

        post._id = res._id;
        this.show();
      }.bind(this));
    }
  }
  cancelPostChanges(domID) {
    var values = this.getPost();
    var post = this.blog.getPost(domID);
    if (post._id) {
      this.blog.stopEditingPost(domID);
    } else {
      this.blog.deletePost(domID);
    }
    this.show();
  }
  editPost(domID) {
    if (!this.blog.editPost(domID)) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html("could set edit on post");
      return;
    }
    this.show();
    document.getElementById("posttitle").select();
  }
  deletePost(domID) {
    var post = this.blog.deletePost(domID);
    this.show();

    datastore("DELETE", "deletePost", post.exportObject(), function (err,res) {
      if (err) {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
        return;
      }
    });
  }
}

module.exports = ctlBlog;
