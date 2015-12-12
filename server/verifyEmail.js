var email = require("./email");

exports.sendEmailVerification = function (host,to,from,hash,code) {
  var link = "http://" + host + "/verifyEmail/" + hash + "/" + code;
  var mailOptions = {
    from: from, // sender address
    to: to, // list of receivers
    subject: "ChronoFeed - Verify Email Address", // Subject line
    text: 'Please verify your email address by following this link: ' + link, // plaintext body
    html: 'Please verify your email address by following this link: <a href="' + link + '">Verify</a>' // html body
  };

  return email.sendMail(mailOptions);
}
