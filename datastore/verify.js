var util = require("./util");
var crypto = require("crypto");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var expiringDocs = require("./expiringDocs");

exports.createVerifyInfo = function (host,userID,email,db,callback) {
  var verifyInfo = {};
  var h = new crypto.Hash("sha256");
  h.update(email);
  verifyInfo.userID = userID;
  verifyInfo.type = "email";
  verifyInfo.hash = h.digest("hex");
  verifyInfo.code = crypto.randomBytes(256/8).toString("hex");
  var verify = db.collection("verify");
  verify.insert(verifyInfo, function (err,res) {
    if (err) {
      return callback(err);
    }

    sendEmailVerification(host, email, verifyInfo.hash, verifyInfo.code);
    callback();
  });
};

function sendEmailVerification (host,email,hash,code,callback) {
  var link = "http://" + host + "/verifyEmail/" + hash + "/" + code;
  var mailOptions = {
      from: "ChronoFeed <" + process.env.NODEMAILER_USER + ">", // sender address
      to: email, // list of receivers
      subject: "ChronoFeed - Verify Email Address", // Subject line
      text: 'Please verify your email address by following this link: ' + link, // plaintext body
      html: 'Please verify your email address by following this link: <a href="' + link + '">Verify</a>' // html body
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

exports.verifyEmail = function (req,res,next) {
  console.log("verifyEmail");
  util.getJSONFromBody(req, function (err, obj) {
    console.log("Verify " + obj.hash + " " + obj.code);
    var verify = req.db.collection("verify");
    var filter = {
      hash: obj.hash,
      code: obj.code
    };
    verify.findOne(filter, function (err,res2) {
      if (err) {
        return next(err);
      }

      if (!res2) {
        // already verified
        res.end();
        return;
      }

      var users = req.db.collection("users");
      var filter = {
        _id: new ObjectID(res2.userID)
      };
      users.findOne(filter, function (err,res3) {
        if (err) {
          return next(err);
        }

        if (!res3) {
          return next("Could not find user");
        }

        res3.emailVerified = true;
        users.updateOne(filter, res3, function (err, res4) {
          if (err) {
            return next(err);
          }

          if (res4.modifiedCount < 1) {
            return next("could not update user");
          }

          var filter = {
            _id: res2._id
          };
          verify.deleteOne(filter, function (err,res5) {
            if (err) {
              return next(err);
            }
            res.end();
          });
        });
      });
    });
  });
};

exports.cleanupVerify = function (req,res,next) {
  expiringDocs.cleanupExpired(req.db, "verify").then(
    function (count) {
      res.json({
        count: count
      });
    },
    function (err) {
      next(err);
    }
  );
};
