var util = require("./util");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

exports.userList = function (req,res,next) {
  console.log("get user list");

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
  util.getJSONFromBody(req, function (error, obj) {
    if (error) {
      next(error);
      return;
    }

    console.log("delete user", obj);
    var users = req.db.collection("users");
    users.deleteOne({_id:new ObjectID(obj.id)}, function (err,result) {
      if (err) {
        next(err);
        return;
      }

      if (result.result.ok) {
        res.end();
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

    res.json(doc);
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
    users.updateOne({_id:new ObjectID(req.session.userID)}, obj, function (err,result) {
      if (err) {
        return next(err);
      }

      if (!result.result.ok) {
        return next("could not find user profile");
      }

      res.end();
    });
  });
};
