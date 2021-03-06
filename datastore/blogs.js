"use strict";
var util = require("./util");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var modelBlogList = require("../model/blogList");
var modelBlog = require("../model/blog");
var modelPost = require("../model/post");

exports.BlogList = function (req,res,next) {
  if (!req.session.userID) {
    return next("user is not logged in");
  }

  var blogs = req.db.collection("blogs");
  blogs.find({userID:req.session.userID},function (error,result) {
    if (error) {
      next(error);
      return;
    }

    result.toArray(function (err,list) {
      if (err) {
        next(err);
        return;
      }

      var blogList = new modelBlogList.BlogList();
      for (var obj of list) {
        var blogInfo = new modelBlog.BlogInfo();
        blogInfo.loadObject(obj);
        blogList.add(blogInfo);
      }

      res.json(blogList.exportObject());
    });
  });
};

exports.createBlog = function (req,res,next) {
  if (!req.session.userID) {
    return next("user is not logged in");
  }

  util.getJSONFromBody(req, function (err,obj) {
    if (err) {
      return next(err);
    }

    var blogs = req.db.collection("blogs");
    delete obj._id;
    obj.userID = req.session.userID;
    blogs.insertOne(obj, function (err,res2) {
      if (err) {
        return next(err);
      }

      var blog = res2.ops[0];
      res.json(blog);
    });
  });
};

exports.deleteBlog = function (req,res,next) {
  if (!req.session.userID) {
    return next("user is not logged in");
  }

  var blogs = req.db.collection("blogs");
  let filter = {
    title: req.api.title,
    userID: req.session.userID
  };
  blogs.findOneAndDelete(filter, function (err, findDeleteResult) {
    if (err) {
      return next(err);
    }

    if (findDeleteResult.ok) {
      var posts = req.db.collection("posts");
      var filter = {
        blogID: findDeleteResult.value._id,
        userID: req.session.userID
      };
      posts.deleteMany(filter, function (err,res3) {
        if (err) {
          return next(err);
        }

        res.end();
      });
    } else {
      next("blog not deleted because the blog was not found");
    }
  });
};

exports.readBlog = function (req,res,next) {
  if (!req.session.userID) {
    return next("user is not logged in");
  }

  let filter = {
    title: req.api.title,
    userID: req.session.userID
  };
  var blogs = req.db.collection("blogs");
  blogs.findOne(filter, function (err,res2) {
    if (err) {
      return next(err);
    }

    if (!res2) {
      return next("could not find blog");
    }

    var blog = new modelBlog.Blog(res2._id, res2.title);

    var posts = req.db.collection("posts");
    posts.find({blogID:blog._id.toString(),userID:req.session.userID}, function (err,res3) {
      res3.toArray(function (err, list) {
        if (err) {
          return next(err);
        }

        for (let obj of list) {
          var post = new modelPost.Post(obj._id, obj.title, obj.text, new Date(obj.date), obj.blogID);
          blog.addPost(post);
        }
        res.json(blog.exportObject());
      });
    });
  });
};

exports.saveBlog = function (req,res,next) {
  if (!req.session.userID) {
    return next("user is not logged in");
  }

  util.getJSONFromBody(req, function (err,obj) {
    if (err) {
      return next(err);
    }

    var blogs = req.db.collection("blogs");
    var filter = {
      title: req.api.title,
      userID: req.session.userID
    };
    delete obj._id;
    let saveObj = {
      $set: obj
    };
    blogs.updateOne(filter, saveObj, function (err, res2) {
      if (err) {
        return next(err);
      }

      if (res2.modifiedCount < 1) {
        return next("could not find blog");
      }

      res.end();
    });
  });
};
