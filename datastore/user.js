var pg = require("pg");
var util = require("./util");

function user(inObject,callback) {
  console.log(inObject);
  if (inObject.action == "login") {
    userLogin(inObject.user,callback);
  } else {
    callback({
      success: false,
      error: "Invalid user action: " + inObject.action
    });
  }
}

function userLogin(user,callback) {
  pg.connect(process.env.DATABASE_URL, function (error,client,done) {
    if (error) {
      util.sendError(error,callback);
      return
    }

    var str = "SELECT user_id FROM users WHERE (username = $1 OR email = $2) AND password = $3";
    var args = [user.username,user.username,user.password];
    q = client.query(str, args);

    q.on("error", function (error) {
      util.sendError(error,callback);
    });

    var ret = null;
    q.on("row", function (row) {
      if (!ret) {
        ret = {
          success: true,
          login: true,
          userID: row.user_id
        };
      }
    });

    q.on("end", function () {
      done();
      if (!ret) {
        ret = {
          success: true,
          login: false
        };
      }
      callback(ret);
    });
  });
}

module.exports = user;
