"use strict";

var util = require("./util");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var verify = require("./verify");
var modelUserList = require("../model/userList");

exports.userList = function (req,res,next) {
  if (!req.session.userID) {
    return next("user is not logged in");
  }

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
  if (!req.session.userID) {
    return next("user is not logged in");
  }

  var users = req.db.collection("users");
  var filter = {
    _id: new ObjectID(req.api.id)
  };
  users.deleteOne(filter, function (err,result) {
    if (err) {
      next(err);
      return;
    }

    if (result.result.ok) {
      var blogs = req.db.collection("blogs");
      var filter = {
        userID: req.api.id
      };
      blogs.deleteMany(filter, function (err,res2) {
        if (err) {
          return next(err);
        }

        var posts = req.db.collection("posts");
        var filter = {
          userID: req.api.id
        };
        posts.deleteMany(filter, function (err, res3) {
          if (err) {
            return next(err);
          }

          var verify = req.db.collection("verify");
          var filter = {
            userID: req.api.id
          };
          verify.deleteMany(filter, function (err, res4) {
            if (err) {
              return next(err);
            }

            var resetCol = req.db.collection("reset");
            resetCol.deleteMany(filter, function (err, res5) {
              if (err) {
                return next(err);
              }

              res.end();
            });
          });
        });
      });
    } else {
      next("user was not deleted because the user was not found");
    }
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

    var user = new modelUserList.User();
    user.loadObject(doc);
    res.json(user.exportObject());
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

    users.findOne({_id:new ObjectID(req.session.userID)}, function (err, current) {
      if (err) {
        return next(err);
      }

      // reply object
      let ret = {};

      if (obj.email == current.email) {
        obj.emailVerified = current.emailVerified;
      } else {
        obj.emailVerified = false;
        ret.checkEmail = true;
      }
      obj.joinedDate = current.joinedDate;

      // check of email already used
      let filter = {
        _id: {"$ne": current._id},
        email: obj.email
      };
      users.findOne(filter, function (err, userObj) {
        if (err) {
          return next(err);
        }

        if (userObj) {
          return next("Another user is already using this email address");
        }

        let updateObj = {
          $set: obj
        };
        users.updateOne({_id:new ObjectID(req.session.userID)}, updateObj, function (err,result) {
          if (err) {
            return next(err);
          }

          if (!result.result.ok) {
            return next("could not find user profile");
          }

          verify.createVerifyInfo(req.get("host"), req.session.userID, obj.email, req.db, function (err) {
            if (err) {
              return next(err);
            }

            notifyPreviousEmailAddress(req.get("host"), current.email);
            res.json(ret);
          });
        });
      });
    });
  });
};

function notifyPreviousEmailAddress(host,email,callback) {
  var mailOptions = {
      from: "Grackle <" + process.env.NODEMAILER_USER + ">",
      to: email,
      subject: "Grackle - Email Address Changed",
      text: "This is a notification that your email address was changed.\n\nhttp://" + host,
      html: "<p>This is a notification that your email address was changed.</p><p><a href=\"" + host + "\">Visit Grackle</a></p>"
  };

  util.transporter.sendMail(mailOptions, function(err, info) {
    if(err){
        console.log(err);
        if (callback) {
          callback(err);
        }
        return;
    }

    console.log('Message sent: ' + info.response);
    if (callback) {
      callback();
    }
  });
}

exports.resendVerification = function (req,res,next) {
  if (!req.session.userID) {
    return next("user not logged in");
  }

  let users = req.db.collection("users");
  let filter = {
    _id: new ObjectID(req.session.userID)
  };
  users.findOne(filter, function (err,userDoc) {
    if (err) {
      return next(err);
    }

    if (userDoc.emailVerified) {
      return next("Email addresss was already verified");
    }

    verify.createVerifyInfo(req.get("host"), req.session.userID, userDoc.email, req.db, function (err) {
      if (err) {
        return next(err);
      }

      res.end();
    });
  });
};
