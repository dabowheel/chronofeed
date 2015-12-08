"use strict";
let entries = require("../entries");
let assert = require("assert");

describe("entries", function () {
  let userID = "userid1";
  let logID = "logid1";
  let date = new Date();
  let data = {
    which: "Breakfeast",
    details: "eggs and ham",
    seconds: false
  };
  let entryID;
  it("should create an entry", function () {
    let entry = {
      date: date,
      data: data
    };
    return entries.createEntry(global.db, userID, logID, entry).then(function (_id) {
      entryID = _id;
      assert(_id);
    });
  });

  it("should read an entry", function () {
    return entries.readEntry(global.db, userID, logID, entryID).then(function (entry2) {
      assert.equal(entry2._id, entryID);
      assert.equal(entry2.userID, userID);
      assert.equal(entry2.logID, logID);
      assert.deepEqual(entry2.date, date);
      assert.deepEqual(entry2.data, data);
    });
  });

  it("should read a list of entries", function () {
    return entries.readEntryList(global.db, userID, logID).then(function (list) {
      assert(list.length);
      let entry2 = list.filter(function (entry) {
        return entry._id == entryID;
      })[0];
      assert.equal(entry2._id, entryID);
      assert.equal(entry2.userID, userID);
      assert.equal(entry2.logID, logID);
      assert.deepEqual(entry2.date, date);
      assert.deepEqual(entry2.data, data);
    });
  });

  it("should update an entry", function () {
    let entry2 = {
      data: {
        which: "Breakfeast",
        details: "eggs and ham",
        seconds: true
      }
    };
    return entries.updateEntry(global.db, userID, logID, entryID, entry2);
  });

  it("should delete an entry", function () {
    return entries.deleteEntry(global.db, userID, logID, entryID);
  });

  it("should delete all log entries", function () {
    let entry = {
      date: date,
      data: data
    };
    return entries.createEntry(global.db, userID, logID, entry).then(function (_id) {
      return entries.readEntryList(global.db, userID, logID).then(function (list) {
        return entries.deleteEntryList(global.db, userID, logID).then(function (count) {
          assert.equal(count, list.length);
        });
      });
    });
  });
});
