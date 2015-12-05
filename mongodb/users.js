"use strict";
let mongodb = require("mongodb");
let ObjectID = mongodb.ObjectID;
let MongoError = mongodb.MongoError;

exports.signup = function (db, username, email, password) {
  let users = db.collection("users");

  let obj = {
    username: username,
    email: email,
    password: password,
    emailVerify: false,
    joinedDate: new Date()
  };

  return users.insert(obj).then(function (result) {
    let user = result.ops[0];
    return {
      username: user.username,
      _id: user._id.toString()
    };
  }).catch(function (err) {
    if ((err instanceof MongoError) && (err.code == 11000)) {
      if (err.errmsg.match("username")) {
        throw new Error("an existing account uses this username");
      } else if (err.errmsg.match("email")) {
        throw new Error("an existing account uses this email");
      }
    }

    throw err;
  });
};

exports.login = function (db, username, password) {
  let users = db.collection("users");
  let filter = {
    $or: [
      {
        username: username
      },
      {
        email: username
      }
    ]
  };
  return users.find(filter).limit(1).next().then(function (user) {
    if (!user) {
      return {
        success: false
      };
    }
    return {
      success: true,
      username: user.username,
      _id: user._id
    };
  });
};

// used for testing only
exports.getUserID = function (db,username) {
  var users = db.collection("users");

  let filter = {
    username: username
  };

  return users.find(filter).limit(1).next().then(function (result) {
    if (!result) {
      throw new Error("could not be found");
    }

    return result._id;
  });
};

exports.deleteUser = function (db,_id) {
  var users = db.collection("users");
  var filter = {
    _id: new ObjectID(_id)
  };
  users.deleteOne(filter).then(function (result) {
    if (!result.result.ok) {
      throw new Error("could not find user");
    }
  });
};
