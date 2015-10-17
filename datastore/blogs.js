var util = require("./util");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

exports.readBlogList = function (req,res,next) {
  console.log("blogList read");
  var blogs = req.db.collection("blogs");
  blogs.find(function (error,result) {
    if (error) {
      next(error);
      return;
    }

    result.toArray(function (err,list) {
      if (err) {
        next(err);
        return;
      }

      var blogList = {
        list: list
      }
      res.json({
        success: true,
        blogList: blogList
      });
    });
  });
};

exports.createBlog = function (req,res,next) {
  console.log("createBlog");
  util.getJSONFromBody(req, function (err,obj) {
    console.log("obj",obj);
    if (err) {
      return next(err);
    }

    var blogs = req.db.collection("blogs");
    delete obj._id;
    console.log("createBlog before update");
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
  console.log("delete blog");
  util.getJSONFromBody(req, function (err,obj) {
    if (err) {
      return next(err);
    }

    var blogs = req.db.collection("blogs");
    console.log("obj",obj);
    blogs.deleteOne({_id:new ObjectID(obj._id)}, function (err, res2) {
      if (err) {
        return next(err)
      }

      console.log("res2",res2);
      if (res2.result.ok) {
        res.end();
      } else {
        next("blog not deleted because the blog was not found");
      }
    });
  });
};
