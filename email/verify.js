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