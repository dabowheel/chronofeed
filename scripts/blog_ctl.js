var g_blog;

function displayBlog2HTML(blog) {
  var html = "";

  html += "<div class=\"postlist\">";

  // blog title
  if (blog.editBlogTitle) {
    html += "<div><input id=\"blogtitle\" type=\"text\" class=\"field\" value=\"" + blog.title + "\"/></div>";
    html += "<div><span><button class=\"fillerbutton\">Here</button></span><span class=\"listbutton\"><button class=\"savebutton\" onclick=\"saveBlogTitleChange();\">Accept</button><button class=\"savebutton\" onclick=\"cancelBlogTitleChange()\">Cancel</button></span></div>";
  } else {
    html += "<div class=\"blogtitlebox\"><strong class=\"blogtitle\">" + blog.title + "</strong><button onclick=\"editBlogTitle();\">Edit</button></div>";    
  }

  html += "<div id=\"blogmessage\"><div>";
  html += "<button onclick=\"addPost();\">Add Post</button>"

  // new post
  if (blog.editNew) {
    var post = new Post(blog.getDOMID(),"","","",new Date());
    html += "<div id=\"post\" class=\"post\">";
    html += editPost2HTML(post);
    html += "</div>";
  }

  for (var i = 0; i < blog.postList.length; i++) {
    var post = blog.postList[i];
    html += "<div class=\"post\">";
    if (post.domID === blog.editID) {
      html += editPost2HTML(post);
    } else {
      html += displayPost2HTML(post);
    }
    html += "</div>";
  }
  
  html += "</div>"
  return html;
};

function displayPost2HTML(post) {
  var html = "<div><strong>" + post.title + "</strong><span class=\"listbutton\"><button onclick=\"editPost('" + post.domID + "');\">Edit</button><button onclick=\"deletePost('" + post.domID + "')\">Delete</button></span></div>";
  html += "<div>" + post.text + "</div>";
  html += "<div>" + post.date.toLocaleDateString() + " " + post.date.toLocaleTimeString() + "<button class=\"hiddenbutton\">Button to float against</button></div>"; 
  return html;
}

function editPost2HTML(post) {
  var html  = "";
  html += "<input id=\"postdomid\" type=\"hidden\" value=\"" + post.domID + "\"/>";
  html += "<input id=\"postpostid\" type=\"hidden\" value=\"" + post.postID + "\"/>";
  html += "<input id=\"postdate\" type=\"hidden\" value=\"" + post.date.toISOString() + "\"/>";
  html += "<div><strong>Edit</strong></div>";
  html += "<div><input id=\"posttitle\" type=\"text\" style=\"width:100%;box-sizing:border-box;\" value=\"" + (post.title?post.title:"") + "\"/></div>";
  html += "<div><textarea id=\"posttext\" rows=\"5\" style=\"width:100%;box-sizing:border-box;\">"+ (post.text?post.text:"") + "</textarea></div>";
  html += "<div><span><button class=\"fillerbutton\">Here</button></span><span class=\"listbutton\"><button class=\"savebutton\" onclick=\"savePostChanges('" + post.domID + "');\">Accept</button><button class=\"savebutton\" onclick=\"cancelPostChanges('" + post.domID + "')\">Cancel</button></span></div>";
  return html;
}

function displayBlog(blog) {
  document.getElementById("main").innerHTML = displayBlog2HTML(blog);
}

function loadBlogFromServer(blogID) {
  req = {
    type: "blog",
    action: "load",
    blogID: blogID
  }
  datastore(req, function (res) {
    if (res.success) {
      var blog = new Blog("","");
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
  g_blog.editTitle(getBlogTitle());
  g_blog.editBlogTitle = false;
  displayBlog(g_blog);
  req = {
    "type": "blogInfo",
    "action": "save",
    "blogInfo": new BlogInfo(g_blog.blogID, g_blog.title)
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
  g_blog.editNew = true;
  displayBlog(g_blog);
}

function getPost() {
  return {
    domID: document.getElementById("postdomid").value,
    postID: document.getElementById("postpostid").value,
    title: document.getElementById("posttitle").value,
    text: document.getElementById("posttext").value,
    date: new Date(document.getElementById("postdate").value)
  };
}

function getBlogTitle() {
  return document.getElementById("blogtitle").value
}

function savePostChanges(domID) {
  var post = getPost();
  if (post.postID) {
    g_blog.editID = "";
    g_blog.editPost(domID,post);
    displayBlog(g_blog);
    datastore("post","save",post,function (res) {
      if (!res.success) {
        error(res.data);
      }
    });
  } else {
    g_blog.editNew = false;
    g_blog.addPost(post);
    displayBlog(g_blog);
    datastore("post","create",post,function (res) {
      if (res.success) {
        g_blog.updatePostID(domID,res.data)
        displayBlog(g_blog);
      } else {
        error(res.data);
      }
    });
  }
}

function cancelPostChanges(domID) {
  g_blog.editID = ""
  g_blog.editNew = false
  displayBlog(g_blog);
}

function editPost(domID) {
  g_blog.editID = domID;
  console.log("edit",domID);  
  displayBlog(g_blog);
}

function deletePost(domID) {
  post = g_blog.deletePost(domID);
  displayBlog(g_blog);
  datastore("post","delete",post.postID,function (res) {
    if (res.success) {
    } else {
      error(res.data);
    }
  });
}
