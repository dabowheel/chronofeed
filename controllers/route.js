var Login = require("./login");
var Signup = require("./signup");
var Admin = require("./admin");
var Splash = require("./splash");
var ctlBlogList = require("./blogList");
var ctlBlog = require("./blog");
var Profile = require("./profile");
var VerifyEmail = require("./verifyEmail");
var datastore = require("../scripts/datastore");
var ForgotPassword = require("./forgotPassword");
var ResetPassword = require("./resetPassword");
var ResetPasswordResult = require("./resetPasswordResult");
var Designer = require("./designer");
var LogList = require("./loglist");

export default function (pathname, replace) {
  getComponent(pathname, function (c) {
    if (global.component.current) {
      global.component.current.leave();
    }
    global.component.current = c;
    setURL(pathname, c.documentTitle, replace);
    c.show();
  });
}

function getComponent(pathname, callback) {
  var verifyEmailMatch = pathname.match(/^\/verifyEmail\/(.*)\/(.*)$/);
  if (verifyEmailMatch) {
    let c = new VerifyEmail("main", verifyEmailMatch[1], verifyEmailMatch[2]);
    return callback(c);
  }

  var resetPasswordMatch = pathname.match(/^\/resetPassword\/(.*)\/(.*)$/);
  if (resetPasswordMatch) {
    let c = new ResetPassword("main", resetPasswordMatch[1], resetPasswordMatch[2]);
    return callback(c);
  }

  if (pathname == "/resetPasswordResult") {
    let c = new ResetPasswordResult("main");
    return callback(c);
  }

  getUsername(function (err) {
    if (err) {
      let c = new Splash("main", err);
      return callback(c);
    }

    if (global.component.All.username) {
      var designerRE = /^\/log\/(.*)\/designer\/$/;
      var blogRE = /^\/log\/(.*)\/$/;
      if (pathname == "/admin") {
        let c = new Admin("main");
        return callback(c);
      } else if (pathname == "/profile") {
        let c = new Profile("main");
        return callback(c);
      } else if (pathname == "/designer") {
        let c = new Designer("main");
        return callback(c);
      } else if (pathname == "/loglist") {
        let c = new LogList("main");
        return callback(c);
      } else if (pathname.match(designerRE)) {
        let title = decodeURI(pathname.match(designerRE)[1]);
        let c = new Designer("main", title);
        return callback(c);
      } else if (pathname.match(blogRE)) {
        let title = decodeURI(pathname.match(blogRE)[1]);
        let c = new ctlBlog("main", title);
        return callback(c);
      } else {
        let c = new ctlBlogList("main");
        return callback(c);
      }
    } else {
      if (pathname == "/login") {
        let c = new Login("main");
        return callback(c);
      } else if (pathname == "/signup") {
        let c = new Signup("main");
        return callback(c);
      } else if (pathname == "/forgotPassword") {
        let c = new ForgotPassword("main");
        return callback(c);
      } else {
        let c = new Splash("main");
        return callback(c);
      }
    }
  });
}

function getUsername(callback) {
  if (global.component.All.username) {
    return callback();
  }

  datastore("GET", "session", null, function (err,res) {
    if (err) {
      return callback(err);
    }

    global.component.All.username = res.username;
    callback();
  });
}

function setHash(hash) {
  if (hash != hash) {
    location.hash = hash;
  }
}

export function setURL(url,title,replace) {
  url = encodeURI(url);
  if (url != (location.pathname + location.search)) {
    if (!title) {
      title = document.title;
    }
    if (replace || url == "/") {
      history.replaceState("", title, url + location.search);
    } else {
      history.pushState("", title, url + location.search);
    }
    document.title = title;
  }
}
