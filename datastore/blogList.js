var util = require("./util");

exports.read = function (req,res,next) {
  console.log("blogList read");
  var blogs = req.db.collection("blogs");
  blogs.find(function (error,result) {
    if (error) {
      next(error);
      return;
    }

    result.toArray(function (err,list) {
      if (err) {
        next(err);
        return;
      }

      var blogList = {
        userID: req.session.userID,
        list: list
      }
      res.json({
        success: true,
        blogList: blogList
      });
    });
  });
};
