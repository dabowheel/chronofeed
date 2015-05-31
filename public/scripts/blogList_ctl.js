var g_blogList;

function displayBlogList2HTML(blogList,callback) {
  var menuHTML = g_templateList["menu"];
  var template = Handlebars.compile(g_templateList["blogList"]);
  var blogListHTML = template(blogList);
  callback(menuHTML + blogListHTML);
};


function displayBlogList(blogList) {
  displayBlogList2HTML(blogList, function (html) {
    document.getElementById("main").innerHTML = html;
  });
}

function viewBlogList() {
  req = {
    type: "blogList",
    action: "read",
    userID: g_userID
  }
  datastore(req,function (res) {
    if (res.success) {
      var blogList = new BlogList();
      blogList.loadObject(res.blogList);
      g_blogList = blogList;
      displayBlogList(g_blogList);
    } else {
      if (res.endSession) {
        viewLogin();
      } else {
        error(res.error);
      }
    }
  });
}

function addBlog() {
  var blogInfo = new BlogInfo(g_blogList.getDOMID(),0,g_blogList.getNewTitle(),g_blogList.userID);
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
  viewBlog(blogInfo.blogID);
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
