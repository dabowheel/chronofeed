var util = require("./util");
var modelPost = require("../model/post");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

exports.updatePost = function (req,res,next) {
  if (!req.session.userID) {
    return next("user is not logged in");
  }

  util.getJSONFromBody(req, function (err,obj) {
    if (err) {
      return next(err);
    }

    var posts = req.db.collection("posts");
    var post = new modelPost.Post();
    post.loadObject(obj);
    var postObj = post.exportObject(true, true);
    postObj.userID = req.session.userID;
    posts.updateOne({_id:new ObjectID(post._id),userID:req.session.userID}, postObj, function (err,res2) {
      if (err) {
        return next(err);
      }

      if (res2.updatedCount < 1) {
        return next("post not found");
      }

      res.end();
    });
  });
};

exports.createPost = function (req,res,next) {
  if (!req.session.userID) {
    return next("user is not logged in");
  }

  util.getJSONFromBody(req, function (err,obj) {
    if (err) {
      return next(err);
    }

    var posts = req.db.collection("posts");
    var post = new modelPost.Post();
    post.loadObject(obj);
    var postObj = post.exportObject(true, true);
    postObj.userID = req.session.userID;
    posts.insertOne(postObj, function (err, res2) {
      if (err) {
        return next(err);
      }

      var ret = res2.ops[0];
      res.json(ret);
    });
  });
};

exports.deletePost = function (req,res,next) {
  if (!req.session.userID) {
    return next("user is not logged in");
  }

  util.getJSONFromBody(req, function (err,obj) {
    if (err) {
      return next(err);
    }

    var posts = req.db.collection("posts");
    posts.deleteOne({_id:new ObjectID(obj._id),userID:req.session.userID}, function (err,res2) {
      if (err) {
        return next(err);
      }

      if (res2.deletedCount < 1) {
        return next("could not find post");
      }

      res.end();
    });
  });
};
