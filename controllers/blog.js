var views = require("../scripts/views");
var datastore = require("../scripts/datastore");
var modelData = require("../model/data");
var modelBlog = require("../model/blog");
var modelPost = require("../model/post");

function displayBlog2HTML(blog,callback) {
  Handlebars.registerHelper("encodeText", function (str) {
    return str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\n/g,"<br>");
  });

  var template = Handlebars.compile(views.list.menu);
  var menuHTML = template({username:modelData.username});
  template = Handlebars.compile(views.list.blog);
  var blogHTML = template(blog);
  callback(menuHTML + blogHTML);
}

function displayBlog(blog) {
  displayBlog2HTML(blog,function (html) {
    document.getElementById("main").innerHTML = html;
  });
}

function viewBlog(_id) {
  datastore("POST", "readBlog", {_id:_id}, function (err,res) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    console.log("blog",res);
    modelData.blog = new modelBlog.Blog();
    modelData.blog.loadObject(res, true);
    displayBlog(modelData.blog);
  });
}

function editBlogTitle() {
  modelData.blog.editBlogTitle = true;
  displayBlog(modelData.blog);
  document.getElementById("inputTitle").select();
}

function getBlogTitle() {
  return document.getElementById("inputTitle").value;
}

function saveBlogTitleChange() {
  var title = getBlogTitle();
  if (title === modelData.blog.title) {
    cancelBlogTitleChange();
    return;
  }

  if (title === "") {
    $("#inputTitleFormGroup").addClass("has-error");
    return;
  } else if (modelData.blogList.hasTitle(title)) {
    $("#placeForAlert").addClass("alert alert-warning");
    $("#placeForAlert").html("A blog with this title already exists");
    return;
  }

  modelData.blog.editTitle(title);
  cancelBlogTitleChange();

  var blogInfo = new modelBlog.BlogInfo(modelData.blog._id, modelData.blog.title);
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
  modelData.blog.editBlogTitle = false;
  displayBlog(modelData.blog);
}

function addPost() {
  var domID = modelData.blog.getDOMID();
  modelData.blog.addPost(new modelPost.Post("", "", "", new Date(), modelData.blog._id, domID));
  modelData.blog.editPost(domID);
  displayBlog(modelData.blog);
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
  modelData.blog.stopEditingPost(domID);
  if (post._id) {
    modelData.blog.savePost(domID,post);
    displayBlog(modelData.blog);
    datastore("POST", "updatePost", post.exportObject(), function (err,res) {
      if (err) {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
        return;
      }
    });
  } else {
    modelData.blog.savePost(domID,post);
    displayBlog(modelData.blog);
    datastore("POST", "createPost", post.exportObject(), function (err,res) {
      if (err) {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
        return;
      }

      post._id = res._id;
      displayBlog(modelData.blog);
    });
  }
}

function cancelPostChanges(domID) {
  var values = getPost();
  var post = modelData.blog.getPost(domID);
  if (post._id) {
    modelData.blog.stopEditingPost(domID);
  } else {
    modelData.blog.deletePost(domID);
  }
  displayBlog(modelData.blog);
}

function editPost(domID) {
  console.log("domID",domID);
  if (!modelData.blog.editPost(domID)) {
    $("#placeForAlert").addClass("alert alert-warning");
    $("#placeForAlert").html("could set edit on post");
    return;
  }
  displayBlog(modelData.blog);
  document.getElementById("posttitle").select();
}

function deletePost(domID) {
  var post = modelData.blog.deletePost(domID);
  displayBlog(modelData.blog);

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
