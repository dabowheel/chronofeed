var views = require("../scripts/views");
var datastore = require("../scripts/datastore");
var modelData = require("../model/data");

function displayBlog2HTML(blog,callback) {
  Handlebars.registerHelper("encodeText", function (str) {
    return str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\n/g,"<br>");
  });

  menuHTML = views.menu;
  var template = Handlebars.compile(views.blog);
  var blogHTML = template(blog);
  callback(menuHTML + blogHTML);
}

function viewBlog(blog) {
  displayBlog2HTML(blog,function (html) {
    document.getElementById("main").innerHTML = html;
  });
}

function viewBlog(_id) {
  datastore("GET", "readBlog", {_id:_id}, function (err,res) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    modelData.blog = new Blog();
    modelData.blog.loadObject(res.blog);
    g_blog = blog;
    displayBlog(blog);
  });
}

function editBlogTitle() {
  g_blog.editBlogTitle = true;
  displayBlog(g_blog);
}

function saveBlogTitleChange() {
  var title = getBlogTitle();
  if (title != g_blog.title && g_blogList.hasTitle(title)) {
    alert("Another blog already has this title: " + title);
    return;
  }
  g_blog.editTitle(getBlogTitle());
  g_blog.editBlogTitle = false;
  displayBlog(g_blog);
  var req = {
    "type": "blogInfo",
    "action": "update",
    "blogInfo": new BlogInfo("",g_blog.blogID, g_blog.title,g_blog.userID)
  };
  datastore(req, function (res) {
    if (!res.success) {
      error(res.error);
    }
  });
}

function cancelBlogTitleChange() {
  g_blog.editBlogTitle = false;
  displayBlog(g_blog);
}

function addPost() {
  var domID = g_blog.getDOMID();
  g_blog.addPost(new Post(domID,0,"","",new Date(),g_blog.blogID,g_blog.userID));
  g_blog.editPost(domID);
  displayBlog(g_blog);
}

function getPost() {
  var dateOnly = document.getElementById("postdateonly").value;
  var timeOnly = document.getElementById("posttimeonly").value;
  var date = new Date(dateOnly + " " + timeOnly);
  return {
    domID: document.getElementById("postdomid").value,
    postID: Number(document.getElementById("postpostid").value),
    title: document.getElementById("posttitle").value,
    text: document.getElementById("posttext").value,
    date: date,
    blogID: Number(document.getElementById("postblogid").value),
    userID: Number(document.getElementById("postuserid").value),
    dateOnly: dateOnly,
    timeOnly: timeOnly
  };
}

function getBlogTitle() {
  return document.getElementById("blogtitle").value;
}

function savePostChanges(domID) {
  var values = getPost();
  var post = new Post(values.domID,values.postID,values.title,values.text,values.date,values.blogID,values.userID);
  g_blog.stopEditingPost(domID);
  if (post.postID) {
    g_blog.savePost(domID,post);
    displayBlog(g_blog);
    req = {
      type: "post",
      action: "update",
      post: post
    };
    datastore(req,function (res) {
      if (!res.success) {
        error(res.error);
      }
    });
  } else {
    g_blog.savePost(domID,post);
    displayBlog(g_blog);
    req = {
      type: "post",
      action: "create",
      post: post
    };
    datastore(req,function (res) {
      if (res.success) {
        g_blog.updatePostID(domID,res.postID);
        displayBlog(g_blog);
      } else {
        error(res.error);
      }
    });
  }
}

function cancelPostChanges(domID) {
  var values = getPost();
  var post = g_blog.getPost(domID);
  if (post.postID) {
    g_blog.stopEditingPost(domID);
  } else {
    g_blog.deletePost(domID);
  }
  displayBlog(g_blog);
}

function editPost(domID) {
  g_blog.editPost(domID);
  displayBlog(g_blog);
}

function deletePost(domID) {
  post = g_blog.deletePost(domID);
  displayBlog(g_blog);
  req = {
    type: "post",
    action: "delete",
    postID: post.postID
  };
  datastore(req,function (res) {
    if (res.success) {
    } else {
      error(res.error);
    }
  });
}

exports.viewBlog = viewBlog;
