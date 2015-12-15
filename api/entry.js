"use strict";
let entries = require("../mongodb/entries");

exports.createEntry = function(req,res,next) {
  if (!req.session.userID) {
    return next(new Error("user is not logged in"));
  }

  let entry = req.body;
  if (entry.date) {
    entry.date = new Date(entry.date);
  }
  entries.createEntry(req.db, req.session.userID, req.api.logID, entry).then(function (_id) {
    res.json({
      _id: _id
    });
  }).catch(function (err) {
    next(err);
  });
};

exports.readEntry = function (req,res,next) {
  if (!req.session.userID) {
    return next(new Error("user is not logged in"));
  }

  entries.readEntry(req.db, req.session.userID, req.api.logID, req.api.id).then(function (entry) {
    res.json(entry);
  });
};

exports.readEntryList = function (req,res,next) {
  if (!req.session.userID) {
    return next(new Error("user is not logged in"));
  }

  entries.readEntryList(req.db, req.session.userID, req.api.logID).then(function (list) {
    let obj = {
      list: list
    };
    res.json(obj);
  });
};

exports.updateEntry = function (req,res,next) {
  if (!req.session.userID) {
    return next(new Error("user is not logged in"));
  }

  entries.updateEntry(req.db, req.session.userID, req.api.logID, req.api.id, req.body).then(function () {
    res.end();
  });
};

exports.deleteEntry = function (req,res,next) {
  if (!req.session.userID) {
    return next(new Error("user is not logged in"));
  }

  entries.deleteEntry(req.db, req.session.userID, req.api.logID, req.api.id).then(function () {
    res.end();
  });
};

exports.deleteEntryList = function (req,res,next) {
  if (!req.session.userID) {
    return next(new Error("user is not logged in"));
  }

  entries.deleteEntryList(req.db, req.session.userID, req.api.logID).then(function (deletedCount) {
    let obj = {
      deletedCount: deletedCount
    };
    res.json(obj);
  });
};
