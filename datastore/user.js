var util = require("./util");

exports.create = function (req,res,next) {
  util.getJSONFromBody(req, function (error,obj) {
    console.log("create user",obj);

    var users = req.db.collection("users");
    users.insert(obj,function (error, result) {
      if (error) {
        return next(error);
      } else {
        console.log("result",result);
        var userID = result._id;
        req.session.userID = userID;
        res.json({userID:userID});
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
