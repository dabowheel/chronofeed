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
      if (result) {
        userID = result._id;
        success = obj.password == result.password;
      }
      if (success) {
        req.session.userID = userID;
        req.session.username = result.username;
      }
      res.json({
        username: result.username,
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
