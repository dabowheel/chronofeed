var views = require("../scripts/views");
var datastore = require("../scripts/datastore");
var modelBlogList = require("../model/blogList");
var modelBlog = require("../model/blog");
var modelData = require("../model/data");
var ctlBlogList = require("./blogList");
var ctlBlog = require("./blog");
var ctlLogin = require("./login");
var page = require("../scripts/page");

function displayBlogList2HTML(blogList,callback) {
  var template;
  template = Handlebars.compile(views.list.menu);
  var menuHTML = template({username:modelData.username});
  template = Handlebars.compile(views.list.blogList);
  var blogListHTML = template(blogList);
  callback(menuHTML + blogListHTML);
}

function displayBlogList(blogList) {
  page.setURL("/", "Grackle");
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
      modelData.blogList = new modelBlogList.BlogList();
      modelData.blogList.loadObject(res.blogList);
      modelData.blogList.sort();
      displayBlogList(modelData.blogList);
    } else {
      if (res.endSession) {
        ctlLogin.viewLogin();
      } else {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
      }
    }
  });
}

function addBlog() {
  var blogInfo = new modelBlog.BlogInfo(0, modelData.blogList.getNewTitle(), modelData.blogList.getDOMID());
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
};
