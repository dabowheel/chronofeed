"use strict";
var view = require("./blogList.html");
var Menu = require("./menu");
var datastore = require("../scripts/datastore");
var modelBlogList = require("../model/blogList");
var modelBlog = require("../model/blog");
var ctlBlogList = require("./blogList");
var ctlBlog = require("./blog");
var ctlLogin = require("./login");
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
  if (cache.blogList) {
    return callback();
  }

  datastore("GET","readBlogList",null,function (err,res) {
    if (err) {
      return callback(err);
    }

    cache.blogList = new modelBlogList.BlogList();
    cache.blogList.loadObject(res);
    cache.blogList.sort();
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
    displayBlogList(cache.blogList);
  });
}

function addBlog() {
  var blogInfo = new modelBlog.BlogInfo(0, cache.blogList.getNewTitle(), cache.blogList.getDOMID());
  cache.blogList.add(blogInfo);
  displayBlogList(cache.blogList);
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
  var blogInfo = cache.blogList.getBlogInfo(domID);
  ctlBlog.viewBlog(blogInfo._id);
}

function confirmDeleteBlog(domID) {
  var blogInfo = cache.blogList.getBlogInfo(domID);
  $("#deleteHeader").html("Delete " + blogInfo.title);
  document.getElementById("deleteButton").onclick = function () {
    deleteBlog(domID);
  };
  $("#deleteModal").modal("show");
}

function deleteBlog(domID) {
  var blogInfo = cache.blogList.delete(domID);
  displayBlogList(cache.blogList);
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
