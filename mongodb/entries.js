"use strict";
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

exports.createEntry = function (db,userID,logID,entry) {
  var entries = db.collection("entries");
  entry.userID = userID;
  entry.logID = logID;
  return entries.insertOne(entry).then(function (result) {
    return result.ops[0]._id.toString();
  });
};

exports.readEntry = function (db,userID,logID,_id) {
  var entries = db.collection("entries");
  let filter = {
    userID: userID,
    logID: logID,
    _id: new ObjectID(_id)
  };
  return entries.find(filter).limit(1).next().then(function (entry) {
    if (!entry) {
      throw new Error("entry not found");
    }

    return entry;
  });
};

exports.readEntryList = function (db,userID,logID) {
  var entries = db.collection("entries");
  let filter = {
    logID: logID,
    userID: userID
  };
  return entries.find(filter).toArray();
};

exports.updateEntry = function (db,userID,logID,_id,entry) {
  var entries = db.collection("entries");
  let filter = {
    _id: new ObjectID(_id),
    userID: userID,
    logID: logID
  };
  delete entry._id;
  return entries.updateOne({_id:new ObjectID(_id),userID:userID}, entry).then(function (result) {
    if (result.matchedCount < 1) {
      throw new Error("entry not found");
    }
  });
};

exports.deleteEntry = function (db,userID,logID,_id) {
  let entries = db.collection("entries");
  let filter = {
    _id: new ObjectID(_id),
    userID: userID,
    logID: logID
  };
  return entries.deleteOne(filter).then(function (result) {
    if (result.deletedCount < 1) {
      throw new Error("entry not found");
    }
  });
};

exports.deleteEntryList = function (db,userID,logID) {
  let entries = db.collection("entries");
  let filter = {
    userID: userID,
    logID: logID
  };
  return entries.deleteMany(filter).then(function (result) {
    return result.deletedCount;
  });
};
