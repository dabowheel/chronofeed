"use strict";

var util = require("./util");
var crypto = require("crypto");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

exports.forgotPassword = function (req,res,next) {
  util.getJSONFromBody(req, function (err, obj) {
    if (err) {
      return next(err);
    }

    var usersCollection = req.db.collection("users");
    var filter = {
      username: obj.username
    };

    usersCollection.findOne(filter, function (err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next("invalid username");
      }

      var h = new crypto.Hash("sha256");
      h.update(user.email);
      var resetDoc = {
        userID: user._id.toString(),
        code: crypto.randomBytes(256/8).toString("hex"),
        hash: h.digest("hex"),
        reset: false,
        created: new Date()
      };

      var resetCollection = req.db.collection("reset");
      resetCollection.insert(resetDoc, function (err, insertResult) {
        if (err) {
          return next(err);
        }

        sendResetEmail(req.get("host"), user.email, resetDoc.hash, resetDoc.code);
        res.end();
      });
    });
  });
};

function sendResetEmail(host,email,hash,code) {
  var link = "http://" + host + "/resetPassword/" + hash + "/" + code;
  var mailOptions = {
      from: "Grackle <" + process.env.NODEMAILER_USER + ">", // sender address
      to: email, // list of receivers
      subject: "Grackle - Reset Password", // Subject line
      text: 'Reset your password by following this link: ' + link, // plaintext body
      html: 'Reset your password by following this link: <a href="' + link + '">Reset</a>' // html body
  };

  util.transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });
}

exports.resetPassword = function (req,res,next) {
  util.getJSONFromBody(req, function (err,obj) {
    var resetCollection = req.db.collection("reset");
    var filter = {
      hash: obj.hash,
      code: obj.code
    };
    var update = {
      $set: {
        reset: true
      }
    };
    resetCollection.findOneAndUpdate(filter, update, function (err, findUpdateResult) {
      if (err) {
        return next(err);
      }

      let resetDoc = findUpdateResult.value;

      if (!resetDoc) {
        return next("expired reset code");
      }

      if (resetDoc.reset) {
        return next("expired reset code");
      }

      var usersCollection = req.db.collection("users");
      var filter = {
        _id: new ObjectID(resetDoc.userID)
      };
      console.log("resetDoc",resetDoc);
      console.log("filter",filter);
      usersCollection.updateOne(filter, {$set: {password: obj.password}}, function (err,updateResult) {
        if (err) {
          return next(err);
        }

        if (updateResult.modifiedCount < 1) {
          return next("invalid user");
        }
        res.end();
      });
    });
  });
};

exports.cleanupResetHandler = function (req,res,next) {
  exports.cleanupReset(req.db).then(
    function (count) {
      res.json({
        count: count
      });
    }, function (err) {
      next(err);
  });
};

exports.cleanupReset = function (db) {
  return new Promise(function (resolve,reject) {
    let d = new Date();
    d.setDate(d.getDate() - 14);
    let filter = {
      created: {
        $lt: d
      }
    };
    let reset = db.collection("reset");
    reset.deleteMany(filter, function (err, deleteResult) {
      if (err) {
      return reject(err);
      }

      resolve(deleteResult.deletedCount);
    });
  });
};
