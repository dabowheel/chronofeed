"use strict";
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

exports.getJSONFromBody = function (req,callback) {
  var body = "";
  req.on("data", function(data) {
    body += data;
  });
  req.on("end", function() {
    try {
      callback(null,JSON.parse(body));
    } catch (error) {
      callback(error,null);
    }
  });
};

var smtpConfig = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
  },
  secure: true
};

exports.transporter = nodemailer.createTransport(smtpTransport(smtpConfig));

exports.Wait = class {
  constructor (stepCount,callback) {
    this.stepCount = stepCount;
    this.callback = callback;
    this.resolveCount = 0;
    this.rejectCount = 0;
    this.done = false;
  }
  resolve () {
    this.resolveCount++;
    this.check();
  }
  reject () {
    this.rejectCount++;
    this.check();
  }
  check () {
    if (this.done) {
      throw new Error("too many callbacks");
    }
    if ((this.resolveCount + this.rejectCount) >= this.stepCount) {
      this.done = true;
      this.callback(this.resolveCount, this.rejectCount);
    }
  }
};
