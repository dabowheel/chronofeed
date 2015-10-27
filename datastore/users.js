var util = require("./util");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var verify = require("./verify");
var modelUserList = require("../model/userList");

exports.userList = function (req,res,next) {
  if (!req.session.userID) {
    return next("user is not logged in");
  }

  var users = req.db.collection("users");
  users.find(function (error, result) {
    if (error) {
      return next(error);
    } else {
      result.toArray(function (err,list) {
        if (err) {
          next(err);
          return;
        }

        res.json({
          list: list
        });
      });
    }
  });
};

exports.deleteUser = function (req,res,next) {
  if (!req.session.userID) {
    return next("user is not logged in");
  }

  util.getJSONFromBody(req, function (error, obj) {
    if (error) {
      next(error);
      return;
    }

    var users = req.db.collection("users");
    var filter = {
      _id: new ObjectID(obj._id)
    };
    users.deleteOne(filter, function (err,result) {
      if (err) {
        next(err);
        return;
      }

      if (result.result.ok) {
        var blogs = req.db.collection("blogs");
        var filter = {
          userID: obj._id
        };
        blogs.deleteMany(filter, function (err,res2) {
          if (err) {
            return next(err);
          }

          var posts = req.db.collection("posts");
          var filter = {
            userID: obj._id
          };
          posts.deleteMany(filter, function (err, res3) {
            if (err) {
              return next(err);
            }

            var verify = req.db.collection("verify");
            var filter = {
              userID: obj._id
            };
            verify.deleteMany(filter, function (err, res4) {
              if (err) {
                return next(err);
              }

              res.end();
            });
          });
        });
      } else {
        next("user was not deleted because the user was not found");
      }
    });
  });
};

exports.getProfile = function (req,res,next) {
  if (!req.session.userID) {
    return next("user is not logged in");
  }

  var users = req.db.collection("users");
  users.findOne({_id:new ObjectID(req.session.userID)}, function (err, doc) {
    if (err) {
      return next(err);
    }

    if (!doc) {
      return next("user not found");
    }

    var user = new modelUserList.User();
    user.loadObject(doc);
    res.json(user.exportObject());
  });
};

exports.saveProfile = function (req,res,next) {
  if (!req.session.userID) {
    return next("user is not logged in");
  }

  util.getJSONFromBody(req, function (err,obj) {
    if (err) {
      return next(err);
    }

    var users = req.db.collection("users");

    users.findOne({_id:new ObjectID(req.session.userID)}, function (err, current) {
      if (err) {
        return next(err);
      }

      if (obj.email == current.email) {
        obj.emailVerified = current.emailVerified;
      } else {
        obj.emailVerified = false;
      }
      obj.joinedDate = current.joinedDate;

      users.updateOne({_id:new ObjectID(req.session.userID)}, obj, function (err,result) {
        if (err) {
          return next(err);
        }

        if (!result.result.ok) {
          return next("could not find user profile");
        }

        verify.createVerifyInfo(req.get("host"), req.session.userID, obj.email, req.db, function (err) {
          if (err) {
            return next(err);
          }

          res.end();
        });
      });
    });
  });
};
