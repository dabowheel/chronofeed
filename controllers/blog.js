"use strict";
var view = require("./blog.html");
var Menu = require("./menu");
var datastore = require("../scripts/datastore");
var modelBlog = require("../model/blog");
var modelPost = require("../model/post");
var page = require("../scripts/page");
var ctlBlogList = require("./blogList");
var validate = require("../scripts/validate");

function displayBlog2HTML(blog,callback) {
  Handlebars.registerHelper("encodeText", function (str) {
    return str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\n/g,"<br>");
  });

  let menu = new Menu("", false, false);
  menu.render(function (err, menuView) {
    let template = Handlebars.compile(view);
    var blogHTML = template(blog);
    callback(menuView + blogHTML);
  });
}

function onKeypress (e) {
  if (e.keyCode == 13) {
    saveBlogTitleChange();
  }
}

function displayBlog(blog) {
  page.setURL("/blog/" + blog.title, "Grackle Blog | " + blog.title);
  displayBlog2HTML(blog,function (html) {
    document.getElementById("main").innerHTML = html;
  });

  if (global.component.All.blog.editBlogTitle) {
    document.getElementById("inputTitle").onkeypress = onKeypress;
    validate.listenToFields(["inputTitle"], "blogTitleAcceptButton");
  }
}

function getBlog(_id, title, callback) {
  if (_id && global.component.All.blogs[_id]) {
    global.component.All.blog = global.component.All.blogs[_id];
    callback();
    return;
  }

  var criterion;
  if (_id) {
    criterion = {
      _id: _id
    };
  } else {
    criterion = {
      title: title
    };
  }
  datastore("POST", "readBlog", criterion, function (err,res) {
    if (err) {
      return callback(err);
    }

    global.component.All.blog = new modelBlog.Blog();
    global.component.All.blog.loadObject(res, true);
    global.component.All.blogs[global.component.All.blog._id] = global.component.All.blog;
    callback();
  });
}

function viewBlog(_id,title) {
  getBlog(_id, title, function (err) {
    if (err) {
      ctlBlogList.viewBlogList();
      return;
    }
    displayBlog(global.component.All.blog);
  });
}

function editBlogTitle() {
  global.component.All.blog.editBlogTitle = true;
  displayBlog(global.component.All.blog);
  document.getElementById("inputTitle").select();
}

function getBlogTitle() {
  return document.getElementById("inputTitle").value;
}

function saveBlogTitleChange() {
  var title = getBlogTitle();
  if (title === global.component.All.blog.title) {
    cancelBlogTitleChange();
    return;
  }

  if (title === "") {
    $("#inputTitleFormGroup").addClass("has-error");
    return;
  } else if (global.component.All.blogList && global.component.All.blogList.hasTitle(title)) {
    $("#placeForAlert").addClass("alert alert-warning");
    $("#placeForAlert").html("A blog with this title already exists");
    return;
  }

  global.component.All.blog.title = title;
  if (global.component.All.blogList) {
    global.component.All.blogList.updateTitle(global.component.All.blog._id, title);
  }
  cancelBlogTitleChange();

  var blogInfo = new modelBlog.BlogInfo(global.component.All.blog._id, global.component.All.blog.title);
  datastore("POST", "saveBlogTitle", blogInfo.exportObject(), function (err, res) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }
  });
}

function cancelBlogTitleChange() {
  $("#placeForAlert").removeClass("alert alert-warning");
  $("#placeForAlert").html("");
  global.component.All.blog.editBlogTitle = false;
  displayBlog(global.component.All.blog);
}

function addPost() {
  var domID = global.component.All.blog.getDOMID();
  global.component.All.blog.addPost(new modelPost.Post("", "", "", new Date(), global.component.All.blog._id, domID));
  global.component.All.blog.editPost(domID);
  displayBlog(global.component.All.blog);
  document.getElementById("posttitle").select();
}

function getPost() {
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

function savePostChanges(domID) {
  var values = getPost();
  var post = new modelPost.Post(values._id, values.title, values.text, values.date, values.blogID, values.domID);
  global.component.All.blog.stopEditingPost(domID);
  if (post._id) {
    global.component.All.blog.savePost(domID,post);
    displayBlog(global.component.All.blog);
    datastore("POST", "updatePost", post.exportObject(), function (err,res) {
      if (err) {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
        return;
      }
    });
  } else {
    global.component.All.blog.savePost(domID,post);
    displayBlog(global.component.All.blog);
    datastore("POST", "createPost", post.exportObject(), function (err,res) {
      if (err) {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
        return;
      }

      post._id = res._id;
      displayBlog(global.component.All.blog);
    });
  }
}

function cancelPostChanges(domID) {
  var values = getPost();
  var post = global.component.All.blog.getPost(domID);
  if (post._id) {
    global.component.All.blog.stopEditingPost(domID);
  } else {
    global.component.All.blog.deletePost(domID);
  }
  displayBlog(global.component.All.blog);
}

function editPost(domID) {
  if (!global.component.All.blog.editPost(domID)) {
    $("#placeForAlert").addClass("alert alert-warning");
    $("#placeForAlert").html("could set edit on post");
    return;
  }
  displayBlog(global.component.All.blog);
  document.getElementById("posttitle").select();
}

function deletePost(domID) {
  var post = global.component.All.blog.deletePost(domID);
  displayBlog(global.component.All.blog);

  datastore("DELETE", "deletePost", post.exportObject(), function (err,res) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }
  });
}

exports.viewBlog = viewBlog;
exports.setGlobals = function () {
  global.editBlogTitle = editBlogTitle;
  global.saveBlogTitleChange = saveBlogTitleChange;
  global.cancelBlogTitleChange = cancelBlogTitleChange;
  global.addPost = addPost;
  global.savePostChanges = savePostChanges;
  global.cancelPostChanges = cancelPostChanges;
  global.editPost = editPost;
  global.deletePost = deletePost;
};
