var views = require("../scripts/views");
var datastore = require("../scripts/datastore");
var modelBlogList = require("../model/blogList");
var modelBlog = require("../model/blog");
var ctlBlogList = require("./blogList");
var ctlBlog = require("./blog");
var ctlLogin = require("./login");
var page = require("../scripts/page");

function displayBlogList2HTML(blogList,callback) {
  var template;
  template = Handlebars.compile(views.list.menu);
  var menuHTML = template({username:cache.username});
  template = Handlebars.compile(views.list.blogList);
  var blogListHTML = template(blogList);
  callback(menuHTML + blogListHTML);
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
};
