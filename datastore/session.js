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

    console.log("signup", obj);

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
  console.log("login");
  util.getJSONFromBody(req, function (error,obj) {
    if (error) {
      next(error);
      return;
    }
    console.log("login",obj);

    var users = req.db.collection("users");
    users.findOne({$or: [{username:obj.username},{email:obj.username}]}, function (error,result) {
      console.log("found one");
      if (error) {
        next(error);
        return;
      }
      var userID = "";
      var success = false;
      if (result) {
        console.log("result",result);
        console.log("inputPassword",obj.password, typeof obj.password);
        console.log("foundPassword",result.password, typeof result.password);
        console.log("success",obj.password == result.password);
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
  console.log("logout");

  delete req.session.userID;
  delete req.session.username;
  res.end();
};
