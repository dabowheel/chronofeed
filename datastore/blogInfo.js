var util = require("./util");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var blogInfoSchema = new Schema({
  title: String,
  userID: String
});

mongoose.model("blogInfo", blogInfoSchema);

exports.create = function (req,res,next) {
  util.getJSONFromBody(function (error,obj) {
    if (error) {
      return next(error);
    }

    var BlogInfo = mongoose.model("blogInfo");
    info = new BlogInfo(obj);

    if (info.userID != req.session.userID) {
      return next(new Error("Invalid userID: " + info.userID));
    }

    info.save(function (error) {
      if (error) {
        return next(error);
      }

      req.json(info);
    });
  });
};

exports.update = function (req,res,next) {
  util.getJSONFromBody(function (error,obj) {
    if (error) {
      return next(error);
    }

    BlogInfo = mongoose.model("blogInfo");
    
  });
};
