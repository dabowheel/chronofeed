var util = require("./util");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  email: String,
  password: String
});
mongoose.model("user",userSchema);

exports.create = function (req,res,next) {
  util.getJSONFromBody(req, function (error,obj) {
    console.log("create user",obj);
    var User = mongoose.model("user");
    var user = new User(obj);

    user.save(function (error) {
      if (error) {
        return next(error);
      } else {
        req.session.userID = user._id;
        res.json(user);
      }
    });
  });
};

exports.read = function (req,res,next) {
  console.log("read user", req.params);
  var User = mongoose.model("user");
  User.findOne({_id:req.params.id}, function(error,user) {
    if (error) {
      return next(error);
    } else {
      res.json(user);
    }
  });
};

exports.update = function (req,res,next) {
  util.getJSONFromBody(req,function (error,obj) {
    if (error) {
      next(error);
      return;
    }
    console.log("update user",obj);
    User = mongoose.model("user");
    User.update({_id:obj._id}, obj, function (error,user) {
      if (error) {
        return next(error);
      } else {
        res.json(user);
      }
    });
  });
};

exports.delete = function (req,res,next) {
  util.getJSONFromBody(req, function (error, obj) {
    if (error) {
      util.sendError(error,res);
      return;
    }
    console.log("delete user", obj);
    var User = mongoose.model("user");
    User.remove({_id:obj._id}, function (error, user) {
      if (error) {
        return next(error);
      } else {
        res.json(user);
      }
    });
  })
};
