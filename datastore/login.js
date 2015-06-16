var util = require("./util");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

exports.login = function (req,res,next) {
  console.log("login");
  util.getJSONFromBody(req, function (error,obj) {
    if (error) {
      next(error);
      return;
    }
    console.log("login",obj);
    var User = mongoose.model("user");
    User.findOne({$and: [{$or: [{username:obj.username},{email:obj.username}]},{password:obj.password}]}, function (error,user) {
      console.log("found");
      if (error) {
        next(error);
        return;
      }
      req.session.userID = user._id;
      res.json(user);
    });
  });
}
