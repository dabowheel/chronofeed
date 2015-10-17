var views = require("../scripts/views");
var datastore = require("../scripts/datastore");
var BlogList = require("../model/blogList").BlogList;
var ctlBlog = require("./blog_ctl");
var modelBlog = require("../model/blog");
var BlogInfo = modelBlog.BlogInfo;
var modelData = require("../model/data");
var blogList = require("./blogList_ctl");

function displayBlogList2HTML(blogList,callback) {
  var menuHTML = views.list.menu;
  var template = Handlebars.compile(views.list.blogList);
  var blogListHTML = template(blogList);
  callback(menuHTML + blogListHTML);
}

function displayBlogList(blogList) {
  displayBlogList2HTML(blogList, function (html) {
    document.getElementById("main").innerHTML = html;
  });
}

function viewBlogList() {
  datastore("GET","readBlogList",null,function (err,res) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }
    if (res.success) {
      modelData.blogList = new BlogList();
      modelData.blogList.loadObject(res.blogList);
      modelData.blogList.sort();
      displayBlogList(modelData.blogList);
    } else {
      if (res.endSession) {
        viewLogin();
      } else {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
      }
    }
  });
}

function addBlog() {
  var blogInfo = new BlogInfo(0, modelData.blogList.getNewTitle(), modelData.blogList.getDOMID());
  modelData.blogList.add(blogInfo);
  displayBlogList(modelData.blogList);
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
  var blogInfo = modelData.blogList.getBlogInfo(domID);
  ctlBlog.viewBlog(blogInfo._id);
}

function deleteBlog(domID) {
  console.log("delete",domID);
  var blogInfo = modelData.blogList.delete(domID);
  displayBlogList(modelData.blogList);
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
}
