"use strict";
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

exports.createLog = function (db,userID,log) {
  return new Promise(function (resolve,reject) {
    var logs = db.collection("logs");
    delete log._id;
    log.userID = userID;
    logs.insertOne(log, function (err,result) {
      if (err) {
        return reject(err);
      }

      resolve(result.ops[0]);
    });
  });
};

exports.updateLog = function (db,userID,_id,log) {
  return new Promise(function (resolve,reject) {
    var logs = db.collection("logs");
    var filter = {
      _id: new ObjectID(_id),
      userID: userID
    };
    delete log._id;
    let saveObj = {
      $set: log
    };
    logs.updateOne(filter, saveObj, function (err, result) {
      if (err) {
        return reject(err);
      }

      if (result.modifiedCount < 1) {
        return reject("could not find blog");
      }

      resolve();
    });
  });
};

exports.readLogList = function (db,userID) {
  return new Promise(function (resolve,reject) {
    var logs = db.collection("logs");
    logs.find({userID:userID},function (err,result) {
      if (err) {
        return reject(err);
        return;
      }

      result.toArray(function (err,list) {
        if (err) {
          return reject(err);
        }

        resolve(list);
      });
    });
  });
};

exports.readLog = function (db,userID,_id) {
  return new Promise(function (resolve,reject) {
    let filter = {
      _id: new ObjectID(_id),
      userID: userID
    };
    var logs = db.collection("logs");
    logs.findOne(filter, function (err,result) {
      if (err) {
        return reject(err);
      }

      if (!result) {
        return reject("could not find blog");
      }

      resolve(result);
    });
  });
};

exports.deleteLog = function (db,userID,_id) {
  return new Promise(function (resolve,reject) {
    var logs = db.collection("logs");
    let filter = {
      _id: new ObjectID(_id),
      userID: userID
    };
    logs.findOneAndDelete(filter, function (err, result) {
      if (err) {
        return reject(err);
      }

      if (!result.ok) {
        return reject("blog not deleted because the blog was not found");
      }

      var entries = db.collection("entries");
      var filter = {
        logID: _id,
        userID: userID
      };
      entries.deleteMany(filter, function (err,result) {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  });
};

exports.deleteLogList = function (db,userID) {
  return new Promise(function (resolve,reject) {
    var logs = db.collection("logs");
    var filter = {
      userID: userID
    };
    logs.deleteMany(filter, function (err,result) {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
};
