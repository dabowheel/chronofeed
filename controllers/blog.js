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

  if (cache.blog.editBlogTitle) {
    document.getElementById("inputTitle").onkeypress = onKeypress;
    validate.listenToFields(["inputTitle"], "blogTitleAcceptButton");
  }
}

function getBlog(_id, title, callback) {
  if (_id && cache.blogs[_id]) {
    cache.blog = cache.blogs[_id];
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

    cache.blog = new modelBlog.Blog();
    cache.blog.loadObject(res, true);
    cache.blogs[cache.blog._id] = cache.blog;
    callback();
  });
}

function viewBlog(_id,title) {
  getBlog(_id, title, function (err) {
    if (err) {
      ctlBlogList.viewBlogList();
      return;
    }
    displayBlog(cache.blog);
  });
}

function editBlogTitle() {
  cache.blog.editBlogTitle = true;
  displayBlog(cache.blog);
  document.getElementById("inputTitle").select();
}

function getBlogTitle() {
  return document.getElementById("inputTitle").value;
}

function saveBlogTitleChange() {
  var title = getBlogTitle();
  if (title === cache.blog.title) {
    cancelBlogTitleChange();
    return;
  }

  if (title === "") {
    $("#inputTitleFormGroup").addClass("has-error");
    return;
  } else if (cache.blogList && cache.blogList.hasTitle(title)) {
    $("#placeForAlert").addClass("alert alert-warning");
    $("#placeForAlert").html("A blog with this title already exists");
    return;
  }

  cache.blog.title = title;
  if (cache.blogList) {
    cache.blogList.updateTitle(cache.blog._id, title);
  }
  cancelBlogTitleChange();

  var blogInfo = new modelBlog.BlogInfo(cache.blog._id, cache.blog.title);
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
  cache.blog.editBlogTitle = false;
  displayBlog(cache.blog);
}

function addPost() {
  var domID = cache.blog.getDOMID();
  cache.blog.addPost(new modelPost.Post("", "", "", new Date(), cache.blog._id, domID));
  cache.blog.editPost(domID);
  displayBlog(cache.blog);
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
  cache.blog.stopEditingPost(domID);
  if (post._id) {
    cache.blog.savePost(domID,post);
    displayBlog(cache.blog);
    datastore("POST", "updatePost", post.exportObject(), function (err,res) {
      if (err) {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
        return;
      }
    });
  } else {
    cache.blog.savePost(domID,post);
    displayBlog(cache.blog);
    datastore("POST", "createPost", post.exportObject(), function (err,res) {
      if (err) {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
        return;
      }

      post._id = res._id;
      displayBlog(cache.blog);
    });
  }
}

function cancelPostChanges(domID) {
  var values = getPost();
  var post = cache.blog.getPost(domID);
  if (post._id) {
    cache.blog.stopEditingPost(domID);
  } else {
    cache.blog.deletePost(domID);
  }
  displayBlog(cache.blog);
}

function editPost(domID) {
  if (!cache.blog.editPost(domID)) {
    $("#placeForAlert").addClass("alert alert-warning");
    $("#placeForAlert").html("could set edit on post");
    return;
  }
  displayBlog(cache.blog);
  document.getElementById("posttitle").select();
}

function deletePost(domID) {
  var post = cache.blog.deletePost(domID);
  displayBlog(cache.blog);

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
