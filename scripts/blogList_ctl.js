var g_blogList;

function displayBlogList2HTML(blogList) {
  var html = "";

  html += menu2HTML();
  html += "<div class=\"bloglist\">";
  html += "<div id=\"bloglistmessage\"><div>";
  html += "<button onclick=\"addBlog();\">Add Blog</button>";

  for (var i = 0; i < blogList.list.length; i++) {
    var blog = blogList.list[i];
    html += "<div class=\"bloginfo\">";
    html += displayBlogInfo2HTML(blog);
    html += "</div>";
  }  
  html += "</div>"

  return html;
};

function displayBlogInfo2HTML(blogInfo) {
  var html = "<div><strong>" + blogInfo.title + "</strong><button class=\"hiddenbutton\">button to float against</button><span class=\"listbutton\"><button onclick=\"editBlog('" + blogInfo.domID + "');\">Edit</button><button onclick=\"deleteBlog('" + blogInfo.domID + "')\">Delete</button></span></div>";
  return html;
}

function displayBlogList(blogList) {
  document.getElementById("main").innerHTML = displayBlogList2HTML(blogList);
}

function initialLoad() {
  if (g_blog) {
    loadBlogFromServer(g_blog.blogID);
  } else {
    loadBlogListFromServer();
  }
}

function loadBlogListFromServer() {
  req = {
    type: "blogList",
    action: "load"
  }
  datastore(req,function (res) {
    if (res.success) {
      var blogList = new BlogList();
      blogList.loadObject(res.blogList);
      g_blogList = blogList;
      displayBlogList(g_blogList);
    } else {
      if (res.endSession) {
        window.location.assign("login.html");
      } else {
        error(res.error);
      }
    }
  });
}

function addBlog() {
  var blogInfo = new BlogInfo(g_blogList.getDOMID(),"",g_blogList.getNewTitle());
  g_blogList.add(blogInfo);
  displayBlogList(g_blogList);
  req = {
    type: "blogInfo",
    action: "create",
    blogInfo: blogInfo
  }
  datastore(req,function (res) {
    if (res.success) {
      blogInfo.blogID = res.blogID;
    } else {
      error(res.error);
    }
  });
}

function editBlog(domID) {
  var blogInfo = g_blogList.getBlogInfo(domID);
  loadBlogFromServer(blogInfo.blogID);
}

function deleteBlog(domID) {
  console.log("delete",domID);
  var blogInfo = g_blogList.delete(domID);
  displayBlogList(g_blogList);
  var req = {
    type: "blogInfo",
    action: "delete",
    blogID: blogInfo.blogID
  }
  datastore(req,function(res) {
    if (!res.success) {
      error(res.error);
    }
  });
}
