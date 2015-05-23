var g_blog;

function displayBlog2HTML(blog,callback) {
  getTemplateSource("blog",function(source) {
    var template = Handlebars.compile(source);
    console.log(blog);
    var html = template(blog);
    callback(html);
  });
}

function displayBlog(blog) {
  displayBlog2HTML(blog,function (html) {
    document.getElementById("main").innerHTML = html;
  });
}

function loadBlogFromServer(blogID) {
  req = {
    type: "blog",
    action: "load",
    blogID: blogID
  };
  datastore(req, function (res) {
    if (res.success) {
      var blog = new Blog("","","");
      blog.loadObject(res.blog);
      g_blog = blog;
      displayBlog(blog);
    } else {
      error(res.data);
    }
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
    return
  }
  g_blog.editTitle(getBlogTitle());
  g_blog.editBlogTitle = false;
  displayBlog(g_blog);
  var req = {
    "type": "blogInfo",
    "action": "save",
    "blogInfo": new BlogInfo(g_blog.blogID,g_blog.blogID, g_blog.title,g_blog.userID)
  }
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
  var domID = g_blog.getDOMID()
  g_blog.addPost(new Post(domID,"","","",new Date(),g_blog.blogID,g_blog.userID));
  g_blog.editPost(domID);
  displayBlog(g_blog);
}

function getPost() {
  var dateOnly = document.getElementById("postdateonly").value
  var timeOnly = document.getElementById("posttimeonly").value
  var date = new Date(dateOnly + " " + timeOnly)
  return {
    domID: document.getElementById("postdomid").value,
    postID: document.getElementById("postpostid").value,
    title: document.getElementById("posttitle").value,
    text: document.getElementById("posttext").value,
    date: date,
    blogID: document.getElementById("postblogid").value,
    userID: document.getElementById("postuserid").value,
    dateOnly: dateOnly,
    timeOnly: timeOnly
  };
}

function getBlogTitle() {
  return document.getElementById("blogtitle").value
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
      action: "save",
      post: post
    }
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
    }
    datastore(req,function (res) {
      if (res.success) {
        g_blog.updatePostID(domID,res.postID)
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
  }
  datastore(req,function (res) {
    if (res.success) {
    } else {
      error(res.error);
    }
  });
}
