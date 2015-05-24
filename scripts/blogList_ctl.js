var g_blogList;

function displayBlogList2HTML(blogList,callback) {
  var menuHTML,blogListHTML;

  function getBoth() {
    if (menuHTML && blogListHTML) {
      callback(menuHTML + blogListHTML);
    }
  }

  getTemplateSource("menu", function (source) {
    menuHTML = source;
    getBoth()
  });

  getTemplateSource("blogList", function (source) {
    var template = Handlebars.compile(source);
    blogListHTML = template(blogList);
    getBoth()
  });
};


function displayBlogList(blogList) {
  displayBlogList2HTML(blogList, function (html) {
    document.getElementById("main").innerHTML = html;
  });
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
  var blogInfo = new BlogInfo(g_blogList.getDOMID(),"",g_blogList.getNewTitle(),g_blogList.userID);
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
