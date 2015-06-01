var util = require("./util");

function request(session,inObject,callback) {
  if (inObject.type == "user") {
    if (inObject.action == "signup") {
      return function (db) {
        userSignup(db,session,inObject.user, callback);
      };
    } else if (inObject.action == "login") {
      return function (db) {
        userLogin(db,session,inObject.user, callback);
      };
    }
  }
}

function userSignup(db,session,user,callback) {
  var str = "INSERT INTO users(username,email,password) VALUES($1,$2,$3) RETURNING user_id";
  var args = [user.username,user.email,user.password];
  q = db.query(str,args);

  q.on("error", function (error) {
    db.done();
    util.sendError(error,callback);
  });

  var userID;
  q.on("row", function (row) {
    userID = row.user_id;
  });

  q.on("end", function () {
    db.done();
    session.userID = userID;
    callback({
      success: true,
      userID: userID
    });
  });
}

function userLogin(db,session,user,callback) {
  var str = "SELECT user_id FROM users WHERE (username = $1 OR email = $2) AND password = $3";
  var args = [user.username,user.username,user.password];
  q = db.query(str, args);

  q.on("error", function (error) {
    db.done();
    util.sendError(error,callback);
  });

  var ret = null;
  q.on("row", function (row) {
    if (!ret) {
      session.userID = row.user_id;
      ret = {
        success: true,
        login: true,
        userID: row.user_id
      };
    }
  });

  q.on("end", function () {
    db.done();
    if (!ret) {
      ret = {
        success: true,
        login: false
      };
    }
    callback(ret);
  });
}

module.exports = request;
