"use strict";
var view = require("./blogList.html");
var Menu = require("./menu");
var datastore = require("../scripts/datastore");
var modelBlogList = require("../model/blogList");
var modelBlog = require("../model/blog");
var page = require("../scripts/page");

function displayBlogList2HTML(blogList,callback) {
  let menu = new Menu("", false, false);
  menu.render(function (err, menuView) {
    let template = Handlebars.compile(view);
    var blogListHTML = template(blogList);
    callback(menuView + blogListHTML);
  });
}

function displayBlogList(blogList) {
  displayBlogList2HTML(blogList, function (html) {
    document.getElementById("main").innerHTML = html;
  });
}

function getBlogList(callback) {
  if (global.component.All.blogList) {
    return callback();
  }

  datastore("GET","readBlogList",null,function (err,res) {
    if (err) {
      return callback(err);
    }

    global.component.All.blogList = new modelBlogList.BlogList();
    global.component.All.blogList.loadObject(res);
    global.component.All.blogList.sort();
    callback();
  });
}

function viewBlogList() {
  getBlogList(function (err) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    page.setURL("/", "Grackle");
    displayBlogList(global.component.All.blogList);
  });
}

function addBlog() {
  var blogInfo = new modelBlog.BlogInfo(0, global.component.All.blogList.getNewTitle(), global.component.All.blogList.getDOMID());
  global.component.All.blogList.add(blogInfo);
  displayBlogList(global.component.All.blogList);
  datastore("POST", "createBlog", blogInfo.exportObject(), function (err,res) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    blogInfo._id = res._id;
  });
}

function editBlog(domID) {
  var blogInfo = global.component.All.blogList.getBlogInfo(domID);
  page.setURL("/blog/" + blogInfo.title);
  global.viewInitial();
}

function confirmDeleteBlog(domID) {
  var blogInfo = global.component.All.blogList.getBlogInfo(domID);
  $("#deleteHeader").html("Delete " + blogInfo.title);
  document.getElementById("deleteButton").onclick = function () {
    deleteBlog(domID);
  };
  $("#deleteModal").modal("show");
}

function deleteBlog(domID) {
  var blogInfo = global.component.All.blogList.delete(domID);
  displayBlogList(global.component.All.blogList);
  datastore("DELETE", "deleteBlog", blogInfo.exportObject(), function(err,res) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }
  });
}

exports.viewBlogList = viewBlogList;
exports.setGlobals = function () {
  global.addBlog = addBlog;
  global.editBlog = editBlog;
  global.deleteBlog = deleteBlog;
  global.confirmDeleteBlog = confirmDeleteBlog;
};
