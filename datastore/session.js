var util = require("./util");

exports.session = function (req,res,next) {
  res.json({
    username: req.session.username
  });
};

exports.signup = function (req,res,next) {
  util.getJSONFromBody(req, function (error,obj) {
    if (error) {
      return next(error);
    }

    var users = req.db.collection("users");
    users.insert(obj, function (error,result) {
      if (error) {
        return next(error);
      }

      var userID = result.ops[0]._id;
      req.session.userID = userID;
      res.json({userID:userID});
    });
  });
};

exports.login = function (req,res,next) {
  util.getJSONFromBody(req, function (error,obj) {
    if (error) {
      next(error);
      return;
    }

    var users = req.db.collection("users");
    users.findOne({$or: [{username:obj.username},{email:obj.username}]}, function (error,result) {
      if (error) {
        next(error);
        return;
      }
      var userID = "";
      var success = false;
      var username = "";
      if (result) {
        userID = result._id;
        username = result.username;
        success = obj.password == result.password;
      } else {
        success = false;
      }
      if (success) {
        req.session.userID = userID;
        req.session.username = username;
      }
      res.json({
        username: username,
        success: success
      });
    });
  });
};

exports.logout = function (req,res,next) {
  delete req.session.userID;
  delete req.session.username;
  res.end();
};
