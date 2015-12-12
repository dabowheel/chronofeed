"use strict";
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var config = require("./config");

var smtpConfig = {
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS
  },
  secure: false,
  requireTLS: true
};

let transporter = nodemailer.createTransport(smtpTransport(smtpConfig));

exports.sendMail = function (mailOptions) {
  return new Promise(function (resolve,reject) {
    transporter.sendMail(mailOptions, function(err, info) {
      if(err){
        return reject(err);
      }

      resolve(info.response);
    });
  });
}
