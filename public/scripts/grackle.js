(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var views = require("../scripts/views");
var datastore = require("../scripts/datastore");
var modelAdmin = require("../model/admin");

var g_userList;

function displayAdmin(adminList) {
  var menuHTML = views.list.menu;
  var template = Handlebars.compile(views.list.admin);
  var adminHTML = template(adminList);
  document.getElementById("main").innerHTML = menuHTML + adminHTML;
}

function viewAdmin() {
  datastore("GET", "admin/userList", null, function (err,res) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    g_userList = new modelAdmin.UserList();
    g_userList.loadObject(res);
    console.log("user list", g_userList);
    displayAdmin(g_userList);
  });
}

function deleteUser(id) {
  var obj = {
    id: id
  };
  datastore("DELETE", "admin/deleteUser", obj, function (err, obj) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    console.log("global",g_userList);
    console.log("delete user",id);
    g_userList.delete(id);
    console.log("global",g_userList);
    displayAdmin(g_userList);
  });
}

exports.viewAdmin = viewAdmin;

},{"../model/admin":10,"../scripts/datastore":13,"../scripts/views":14}],2:[function(require,module,exports){
var views = require("../scripts/views");
var datastore = require("../scripts/datastore");
var BlogList = require("../model/blogList").BlogList;
var g_blogList;

function displayBlogList2HTML(blogList,callback) {
  var menuHTML = views.list.menu;
  var template = Handlebars.compile(views.list.blogList);
  var blogListHTML = template(blogList);
  callback(menuHTML + blogListHTML);
}


function displayBlogList(blogList) {
  displayBlogList2HTML(blogList, function (html) {
    document.getElementById("main").innerHTML = html;
  });
}

function viewBlogList() {
  datastore("GET","blogList",null,function (err,res) {
    if (err) {
      error(err);
      return;
    }
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
  };
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
  };
  datastore(req,function(res) {
    if (!res.success) {
      error(res.error);
    }
  });
}

exports.viewBlogList = viewBlogList;

},{"../model/blogList":12,"../scripts/datastore":13,"../scripts/views":14}],3:[function(require,module,exports){
var views = require("../scripts/views");
var datastore = require("../scripts/datastore");

var g_blog;

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

function viewBlog(blogID) {
  req = {
    type: "blog",
    action: "read",
    blogID: blogID
  };
  datastore(req, function (res) {
    if (res.success) {
      var blog = new Blog();
      blog.loadObject(res.blog);
      g_blog = blog;
      displayBlog(blog);
    } else {
      error(res.error);
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

},{"../scripts/datastore":13,"../scripts/views":14}],4:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"../model/blogList":12,"../scripts/datastore":13,"../scripts/views":14,"dup":2}],5:[function(require,module,exports){
(function (global){
var views = require("../scripts/views");
var datastore = require("../scripts/datastore");
var blogList = require("./bloglist_ctl");

var g_userID;

function viewLogin() {
  document.getElementById("main").innerHTML = views.list.login;
}

function getLoginFormValues() {
  return {
    username: document.getElementById("inputUsername").value,
    password: CryptoJS.SHA256(document.getElementById("inputPassword").value).toString()
  };
}

function getPasswordPlain() {
  return document.getElementById("inputPassword").value;
}

function validateLoginForm(values,passwordPlain) {
  var valid = true;

  if (values.username == "") {
    $("#inputUsernameFormGroup").addClass("has-error");
    valid = false;
  } else {
    $("#inputUsernameFormGroup").removeClass("has-error");
  }

  if (passwordPlain == "") {
    $("#inputPasswordFormGroup").addClass("has-error");
    valid = false;
  } else {
    $("#inputPasswordFormGroup").removeClass("has-error");
  }

  return valid;
}

function login() {
  var values = getLoginFormValues();
  if (!validateLoginForm(values, getPasswordPlain())) {
    return;
  }

  datastore("POST", "login", values, function (err,res) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }
    if (res.success) {
        g_userID = res.userID;
        // clear hash
        history.pushState("", document.title, window.location.pathname + window.location.search);
        blogList.viewBlogList();
    } else {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html("Invalid username or password.");
    }
  });
}

exports.viewLogin = viewLogin;
exports.setGlobals = function () {
  global.login = login;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../scripts/datastore":13,"../scripts/views":14,"./bloglist_ctl":4}],6:[function(require,module,exports){
(function (global){
var login = require("./login_ctl.js");
var signup = require("./signup_ctl.js");
var admin = require("./admin_ctl.js");
var splash = require("./splash_ctl.js");
var blogList = require("./blogList_ctl.js");
var views = require("../scripts/views");
var datastore = require("../scripts/datastore");
var menu = require("./menu_ctl");

function getStack() {
  return (new Error()).stack;
}

function error(message) {
  console.error(message, "\n", getStack());
}

function loadAll() {
  loadAssetsFromServer(function () {
    viewInitial();
  });
}

function viewInitial() {
  if (location.hash == "#login") {
    login.viewLogin();
  } else if (location.hash == "#signup") {
    signup.viewSignup();
  } else if (location.hash == "#admin") {
    admin.viewAdmin();
  } else {
    datastore("GET", "session", null, function (err,res) {
      if (err) {
        error(err);
        splash.viewSplash();
        return;
      }
      if (res.userID) {
        blogList.viewBlogList();
      } else {
        splash.viewSplash();
      }
    });
  }
}

window.onhashchange = function () {
  console.log("hash change")
  viewInitial();
};

function loadAssetsFromServer(callback) {
  var promiseList = [];
  var names = ["admin","blog","blogList","login","menu","signup","splash"];
  for (var i in names) {
    promiseList[promiseList.length] = views.getTemplateSource(names[i]);
  }

  p = Promise.all(promiseList);
  p.then(function (val) {
    callback();
  });
}

global.loadAll = loadAll;
login.setGlobals();
menu.setGlobals();
signup.setGlobals();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../scripts/datastore":13,"../scripts/views":14,"./admin_ctl.js":1,"./blogList_ctl.js":2,"./login_ctl.js":5,"./menu_ctl":7,"./signup_ctl.js":8,"./splash_ctl.js":9}],7:[function(require,module,exports){
(function (global){
var datastore = require("../scripts/datastore");
var blogList = require("./blogList_ctl");
var splash = require("./splash_ctl");

function clickBlogList() {
  history.pushState("", document.title, window.location.pathname + window.location.search);
  blogList.viewBlogList();
}

function clickLogout() {
  datastore("GET","logout",null, function(err,res) {
    if (err) {
      $("#menuPlaceForAlert").addClass("alert alert-warning");
      $("#menuPlaceForAlert").html(err);
      return;
    }

    history.pushState("", document.title, window.location.pathname + window.location.search);
    splash.viewSplash();
  });
}

exports.setGlobals = function () {
  global.clickBlogList = clickBlogList
  global.clickLogout = clickLogout;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../scripts/datastore":13,"./blogList_ctl":2,"./splash_ctl":9}],8:[function(require,module,exports){
(function (global){
var views = require("../scripts/views");
var datastore = require("../scripts/datastore");

function viewSignup() {
  document.getElementById("main").innerHTML = views.list.signup;
}

function clickSignup() {
  var values = getSignupFormValues();

  if (!validateSignupForm(values, getPasswordPlain())) {
    return;
  }

  datastore("POST","signup",values,function (err,res) {
    if (err) {
      error(err);
    } else {
      window.location.assign("blog.html");
    }
  });
}

function getSignupFormValues() {
  return {
    username: document.getElementById("inputUsername").value,
    email: document.getElementById("inputEmail").value,
    password: CryptoJS.SHA256(getPasswordPlain()).toString(),
  };
}

function getPasswordPlain() {
  return document.getElementById("inputPassword").value;
}

function validateSignupForm(values,passwordPlain) {
  var valid = true;

  if (values.username == "") {
    $("#inputUsernameFormGroup").addClass("has-error");
    valid = false;
  } else {
    $("#inputUsernameFormGroup").removeClass("has-error");
  }

  if (values.email == "") {
    $("#inputEmailFormGroup").addClass("has-error");
    valid = false;
  } else {
    $("#inputEmailFormGroup").removeClass("has-error");
  }

  if (passwordPlain == "") {
    $("#inputPasswordFormGroup").addClass("has-error");
    valid = false;
  } else if (passwordPlain.length < 8) {
    $("#inputPasswordFormGroup").addClass("has-error");
    $("#placeForAlert").addClass("alert alert-warning");
    $("#placeForAlert").html("Password length must be greater than 8 characters.");
    valid = false;
  } else {
    $("#inputPasswordFormGroup").removeClass("has-error");
    $("#placeForAlert").removeClass("alert alert-warning");
    $("#placeForAlert").html("");
  }

  return valid;
}

exports.viewSignup = viewSignup;
exports.setGlobals = function () {
  global.clickSignup = clickSignup;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../scripts/datastore":13,"../scripts/views":14}],9:[function(require,module,exports){
var views = require("../scripts/views");

function viewSplash() {
  document.getElementById("main").innerHTML = views.list.splash;
}

exports.viewSplash = viewSplash;

},{"../scripts/views":14}],10:[function(require,module,exports){

function User(id,username,email,isAdmin) {
  this.id = id;
  this.username = username;
  this.email = email;
  this.isAdmin = isAdmin;
}

function UserList() {
  this.list = [];
}
UserList.prototype.add = function (user) {
  this.list.push(user);
};
UserList.prototype.loadObject = function (obj) {
  for (var i = 0; i < obj.list.length; i++) {
    var values = obj.list[i];
    this.add(new User(values._id ,values.username, values.email, values.isAdmin));
  }
};
UserList.prototype.delete = function (id) {
  for (var i = 0; i < this.list.length; i++) {
    if (id == this.list[i].id) {
      this.list.splice(i,1);
      return;
    }
  }
};

exports.UserList = UserList;

},{}],11:[function(require,module,exports){
function getInputDateValue(d) {
  return d.getFullYear() + "-" + ((d.getMonth()+1)<10?"0":"") + (d.getMonth()+1) + "-" + (d.getDate()<10?"0":"") + d.getDate();
}
function getInputTimeValue(d) {
  return ((d.getHours()<10)?"0":"") + d.getHours() + ":" + ((d.getMinutes()<10)?"0":"") + d.getMinutes();
}
function toDateString(d) {
  return d.toLocaleDateString() + " " + d.toLocaleTimeString(navigator.language,{hour:"2-digit",minute:"2-digit"});
}
function toDBDateString(d) {
  return getInputDateValue(d) + " " + getInputTimeValue(d);
}

function Post(domID,postID,title,text,date,blogID,userID) {
  if (typeof domID == "string" || domID instanceof String) {
    this.domID = domID;
  } else {
    error("invalid domID: " + domID);
  }

  if (typeof postID == "number") {
    this.postID = postID;
  } else {
    error("invalid postID: " + postID + " type: " + (typeof postID));
  }

  if (typeof title == "string" || title instanceof String) {
    this.title = title;
  } else {
    error("invalid title: " + title);
  }

  if (typeof text == "string" || text instanceof String) {
    this.text = text;
  } else {
    error("invalid text: " + text);
  }

  if (date instanceof Date) {
    this.date = date;
    this.dateString = toDateString(this.date);
    this.dateOnly = getInputDateValue(this.date);
    this.timeOnly = getInputTimeValue(this.date);
    this.dbDateString = toDBDateString(this.date);
  } else {
    error("invalid date: " + date);
  }

  if (typeof blogID == "number") {
    this.blogID = blogID;
  } else {
    error("invalid blogID: " + blogID + " type: " + (typeof blogID));
  }

  if (typeof userID == "number") {
    this.userID = userID;
  } else {
    error("invalid userID: " + userID + " type: " + (typeof userID));
  }
}
Post.prototype.loadObject = function (post) {
  this.Post(post.domID, post.postID, post.title, post.text, post.date, post.blogID, post.userID);
};

function Blog(blogID,title,userID) {
  if (blogID) {
    if (typeof blogID == "number") {
      this.blogID = blogID;
    } else {
      error("invalid blogID: " + blogID + " type: " + (typeof blogID));
    }
  }

  if (title) {
    if (typeof title == "string" || title instanceof String) {
      this.title = title;
    } else {
      error("invalid title: " + title);
    }
  }

  if (userID) {
    if (typeof userID == "number") {
      this.userID = userID;
    } else {
      error("invalid userID: " + userID);
    }
  }

  this.postList = [];
  this.editNew = false;
  this.editID = "";
  this.editBlogTitle = false;
  this.maxPostDOMID = 0;
}
Blog.prototype.getDOMID = function () {
  return (++this.maxPostDOMID).toString();
};
Blog.prototype.appendObjectPost = function (post,domID) {
  this.postList[this.postList.length] = new Post(domID,post.postID,post.title,post.text,new Date(post.date),post.blogID,post.userID);
};
Blog.prototype.loadObject = function (obj) {
  if (obj.blogID) {
    this.blogID = obj.blogID;
  }
  if (obj.title) {
    this.title = obj.title;
  }

  if (obj.userID) {
    this.userID = obj.userID;
  }

  if (obj && obj.postList && obj.postList.length) {
    for (var i = 0; i < obj.postList.length; i++) {
      this.appendObjectPost(obj.postList[i], this.getDOMID());
    }
  }
};
Blog.prototype.editTitle = function(title) {
  this.title = title;
};
Blog.prototype.addPost = function (post) {
  this.postList.unshift(post);
};
Blog.prototype.editPost = function (domID) {
  for (var i = 0; i < this.postList.length; i++) {
    if (this.postList[i].domID == domID) {
      this.postList[i].edit = true;
      break;
    }
  }
};
Blog.prototype.stopEditingPost = function (domID) {
  for (var i = 0; i < this.postList.length; i++) {
    if (this.postList[i].domID == domID) {
      this.postList[i].edit = false;
      break;
    }
  }
};
Blog.prototype.savePost = function (domID,post) {
  for (var i = 0; i < this.postList.length; i++) {
    if (this.postList[i].domID === domID) {
      this.postList[i] = post;
      break;
    }
  }
};
Blog.prototype.updatePostID = function (domID,postID) {
  for (var i = 0; i < this.postList.length; i++) {
    var p = this.postList[i];
    if (p.domID === domID) {
      p.postID = postID;
      break;
    }
  }
};
Blog.prototype.updateBlogID = function(blogID) {
  if (typeof blogID == string || blogID instanceof String) {
    if (!this.blogID) {
      this.blogID = blogID;
      for (var i = 0; i < this.postList.length; i++) {
        this.postList[i].blogID = blogID;
      }
    }
  } else {
    error("Invalid blogID: " + blogID);
  }

};
Blog.prototype.deletePost = function (domID) {
  for (var i = 0; i < this.postList.length; i++) {
    var post = this.postList[i];
    if (post.domID === domID) {
      this.postList.splice(i,1);
      return post;
    }
  }
  return null;
};
Blog.prototype.getPost = function (domID) {
  for (var i = 0; i < this.postList.length; i++) {
    var post = this.postList[i];
    if (post.domID == domID) {
      return post;
    }
  }
};
Blog.prototype.sort = function () {
  this.postList.sort(function (a,b) {
    if (a.title < b.title)
      return -1;
    if (a.title > b.title)
      return 1;
    return 0;
  });
};

function BlogInfo(domID,blogID,title,userID) {
  if (typeof domID == "string" || domID instanceof String) {
    this.domID = domID;
  } else {
    error("Invalid domID: " + domID);
  }

  if (typeof blogID == "number") {
    this.blogID = blogID;
  } else {
    error("Invalid blogID: " + blogID);
  }

  if (typeof title == "string" || title instanceof String) {
    this.title = title;
  } else {
    error("Invalid title: " + title);
  }

  if (typeof userID == "number") {
    this.userID = userID;
  } else {
    error("invalid userID: " + userID);
  }
}

exports.Blog = Blog;
exports.BlogInfo = BlogInfo;

},{}],12:[function(require,module,exports){
var blog = require("./blog");
var BlogInfo = blog.BlogInfo;

function BlogList() {
  this.list = [];
  this.maxDOMID = 0;
  this.userID = "";
}
BlogList.prototype.getDOMID = function () {
  return (++this.maxDOMID).toString();
};
BlogList.prototype.loadObject = function (obj) {
  if (obj.userID) {
    this.userID = obj.userID;
  }

  if (obj && obj.list && obj.list.length) {
    for (var i = 0; i < obj.list.length; i++) {
      var values = obj.list[i];
      this.list[this.list.length] = new BlogInfo(this.getDOMID(),values.blogID,values.title,values.userID);
    }
  }
};
BlogList.prototype.getBlogInfo = function (domID) {
  for (var i = 0; i < this.list.length; i++) {
    if (this.list[i].domID == domID) {
      return this.list[i];
    }
  }
};
BlogList.prototype.add = function (blogInfo) {
  this.list.unshift(blogInfo);
  this.sort();
};
BlogList.prototype.sort = function () {
  this.list.sort(function (a,b) {
    if (a.title < b.title)
      return -1;
    if (a.title > b.title)
      return 1;
    return 0;
  });
};
BlogList.prototype.hasTitle = function (title) {
  for (var i = 0; i < this.list.length; i++) {
    if (this.list[i].title == title)
      return true;
  }
  return false;
};
BlogList.prototype.getNewTitle = function () {
  var title;
  for (var i = 1; true; i++) {
    if (i == 1) {
      title = "New Blog";
    } else {
      title = "New Blog " + i.toString();
    }
    if (!this.hasTitle(title)) {
      return title;
    }
  }
};
BlogList.prototype.delete = function (domID) {
  for (var i = 0; i < this.list.length; i++) {
    if (this.list[i].domID == domID) {
      var blogInfo = this.list[i];
      this.list.splice(i,1);
      return blogInfo;
    }
  }
  return null;
};

exports.BlogList = BlogList;

},{"./blog":11}],13:[function(require,module,exports){
function datastore(method,path,obj,callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState==4) {
      if (request.status==200) {
        console.log(method,path,obj)
        console.log(request.responseText);
        var res;
        if (request.responseText == "") {
          callback(null,null);
        } else {
          try {
            res = JSON.parse(request.responseText);
          } catch(e) {
            callback("JSON parse error: " + e);
            return;
          }
          console.log(res);
          callback(null,res);
        }
      } else {
        callback(request.responseText)
      }
    }
  };

  request.open(method,"/datastore/" + path,true);
  if (method == "GET") {
    request.send();
  } else {
    request.setRequestHeader("Content-type","application/json");
    body = JSON.stringify(obj);
    console.log(body);
    request.send(body);
  }
}

module.exports = datastore;

},{}],14:[function(require,module,exports){
var list = [];

function getTemplateSource(name) {
  return new Promise(function (resolve) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState==4 && request.status==200) {
        list[name] = request.responseText;
        resolve();
      }
    };

    request.open("GET","views/" + name + ".html",true);
    request.send();
  });
}

exports.getTemplateSource = getTemplateSource;
exports.list = list;

},{}]},{},[1,3,2,5,6,7,8,9,10,11,12,13,14]);
