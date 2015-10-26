var nodemailer = require("nodemailer");
var util = require("./util");
var smtpTransport = require('nodemailer-smtp-transport');
var crypto = require("crypto");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var smtpConfig = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
  },
  secure: true
};
var transporter = nodemailer.createTransport(smtpTransport(smtpConfig));

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

function sendEmailVerification (host,email,hash,code) {
  var link = "http://" + host + "/verifyEmail/" + hash + "/" + code;
  var mailOptions = {
      from: "Grackle <" + process.env.NODEMAILER_USER + ">", // sender address
      to: email, // list of receivers
      subject: "Grackle - Verify Email Address", // Subject line
      text: 'Please verify your email address by following this link: ' + link, // plaintext body
      html: 'Please verify your email address by following this link: <a href="' + link + '">Verify</a>' // html body
  };

  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });
}

exports.verifyEmail = function (req,res,next) {
  console.log("verifyEmail");
  console.log("Verify " + req.verifyHash + " " + req.verifyCode);
  var verify = req.db.collection("verify");
  var filter = {
    hash: req.verifyHash,
    code: req.verifyCode
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
};
