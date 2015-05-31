var pg = require("pg");
var util = require("./util");

function userSignup(connection,user,callback) {
  var str = "INSERT INTO users(username,email,password) VALUES($1,$2,$3) RETURNING user_id";
  var args = [user.username,user.email,user.password];
  q = connection.query(str,args);

  q.on("error", function (error) {
    connection.done();
    util.sendError(error,callback);
  })

  var userID;
  q.on("row", function (row) {
    userID = row.user_id;
  });

  q.on("end", function () {
    connection.done()
    callback({
      success: true,
      userID: userID
    });
  });
}

function userLogin(connection,user,callback) {
  var str = "SELECT user_id FROM users WHERE (username = $1 OR email = $2) AND password = $3";
  var args = [user.username,user.username,user.password];
  q = connection.query(str, args);

  q.on("error", function (error) {
    connection.done();
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
    connection.done();
    if (!ret) {
      ret = {
        success: true,
        login: false
      };
    }
    callback(ret);
  });
}

function userLogout(connection,inObject,callback) {
  callback()
}

function user(connection,inObject,callback) {
  if (inObject.action == "signup") {
    userSignup(connection,inObject.user, callback);
  } else if (inObject.action == "login") {
    userLogin(connection,inObject.user, callback);
  } else if (inObject.action == "logout") {
    userLogout(connection,inObject, callback);
  } else {
    callback({
      success: false,
      error: "Invalid user action: " + inObject.action
    });
  }
}

module.exports = user;
