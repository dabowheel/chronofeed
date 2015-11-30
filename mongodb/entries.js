var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

exports.createEntry = function (db,userID,entry) {
  return new Promise(function (resolve,reject) {
    var entries = db.collection("entries");
    entry.userID = userID;
    entries.insertOne(entry, function (err, result) {
      if (err) {
        return reject(err);
      }

      resolve(res2.ops[0]);
    });
  });
};

exports.readEntryList = function (db,userID,logID) {
  return new Promise(function (resolve,reject) {
    var entries = db.collection("entries");
    entries.find({logID:logID,userID:userID}, function (err,result) {
      if (err) {
        return reject(err);
      }

      result.toArray(function (err, list) {
        if (err) {
          return reject(err);
        }

        resolve(list);
      });
    });
  });
};

exports.updateEntry = function (db,userID,_id,entry) {
  return new Promise(function (resolve,reject) {
    var entries = db.collection("entries");
    entry.userID = userID;
    entries.updateOne({_id:new ObjectID(_id),userID:userID}, entry, function (err,result) {
      if (err) {
        return reject(err);
      }

      if (result.updatedCount < 1) {
        return reject("entry not found");
      }

      resolve();
    });
  });
};


exports.deleteEntry = function (db,userID,_id) {
  return new Promise(function (resolve,reject) {
    var entries = db.collection("entries");
    entires.deleteOne({_id:new ObjectID(_id),userID:userID}, function (err,result) {
      if (err) {
        return reject(err);
      }

      if (result.deletedCount < 1) {
        return reject("could not find post");
      }

      resolve();
    });
  })
};
