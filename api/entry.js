"use strict";
let entries = require("../mongodb/entries");

exports.createEntry = function(req,res,next) {
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
  entries.readEntry(req.db, req.session.userID, req.api.logID, req.api.id).then(function (entry) {
    res.json(entry);
  });
};
