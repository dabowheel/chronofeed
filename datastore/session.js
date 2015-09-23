var util = require("./util");

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
    users.findOne({$and: [{$or: [{username:obj.username},{email:obj.username}]},{password:obj.password}]}, function (error,result) {
      console.log("found");
      if (error) {
        next(error);
        return;
      }
      var userID;
      console.log("result",result);
      if (result) {
        userID = result._id;
      } else {
        userID = "";
      }
      req.session.userID = userID;
      res.json({userID:userID});
    });
  });
};

exports.logout = function (req,res,next) {
  console.log("logout");
  util.getJSONFromBody(req, function (error,obj) {
    if (error) {
      next(error);
      return;
    }

    delete req.session.userID;
    res.json({});
  });
};
