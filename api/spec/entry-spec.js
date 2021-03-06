"use strict";
let $http = require("http-client-promise");
let assert = require("assert");

describe("entry API", function () {
  let logID = "logid1";
  let date = new Date();
  let data = {
    which: "Breakfeast",
    summary: "eggs and ham",
    seconds: false
  };
  let entryID;

  it("should create an entry", function () {
    let options = {
      hostname: "localhost",
      port: global.port,
      method: "PUT",
      path: "/api/entry/" + logID + "/",
      headers: {
        "Content-Type": "application/json",
        Cookie: global.cookie
      }
    };
    let entry = {
      date: date,
      data: data
    };
    return $http.request(options, JSON.stringify(entry)).then(function (res) {
      return res.getData().then(function (data) {
        assert.equal(res.statusCode, 200, data);
        let obj = JSON.parse(data);
        assert(obj._id);
        entryID = obj._id;
      });
    });
  });

  it("should read an entry", function () {
    let options = {
      hostname: "localhost",
      port: global.port,
      method: "GET",
      path: "/api/entry/" + logID + "/" + entryID + "/",
      headers: {
        Cookie: global.cookie
      }
    };

    return $http.request(options).then(function (res) {
      return res.getData().then(function (resData) {
        assert.equal(res.statusCode, 200, resData);
        let entry2 = JSON.parse(resData);
        if (entry2.date) {
          entry2.date = new Date(entry2.date);
        }
        assert(entry2.userID);
        assert.equal(entry2.logID, logID);
        assert.equal(entry2._id, entryID);
        assert.deepEqual(entry2.date, date);
        assert.deepEqual(entry2.data, data);
      });
    });
  });

  it("should read all entries in a log", function () {
    let options = {
      hostname: "localhost",
      port: global.port,
      method: "GET",
      path: "/api/entry/" + logID + "/",
      headers: {
        Cookie: global.cookie
      }
    };

    return $http.request(options).then(function (res) {
      return res.getData().then(function (body) {
        assert.equal(res.statusCode, 200, body);
        let obj = JSON.parse(body);
        let entry2 = obj.list.filter(function (e) {
          return e._id == entryID;
        })[0];
        if (entry2.date) {
          entry2.date = new Date(entry2.date);
        }
        assert(entry2.userID);
        assert.equal(entry2.logID, logID);
        assert.equal(entry2._id, entryID);
        assert.deepEqual(entry2.date, date);
        assert.deepEqual(entry2.data, data);          
      });
    });
  });

  it("should update an entry", function () {
    let options = {
      hostname: "localhost",
      port: global.port,
      method: "POST",
      path: "/api/entry/" + logID + "/" + entryID + "/",
      headers: {
        "Content-Type": "application/json",
        Cookie: global.cookie
      }
    };

    let entry = {
      data: {
        which: "Breakfeast",
        summary: "eggs and ham",
        seconds: true
      }
    };
    return $http.request(options, JSON.stringify(entry)).then(function (res) {
      return res.getData().then(function (body) {
        assert.equal(res.statusCode, 200, body);
      });
    });
  });

  it("should delete an entry", function () {
    let options = {
      hostname: "localhost",
      port: global.port,
      method: "DELETE",
      path: "/api/entry/" + logID + "/" + entryID + "/",
      headers: {
        Cookie: global.cookie
      }
    };

    return $http.request(options).then(function (res) {
      return res.getData().then(function (body) {
        assert.equal(res.statusCode, 200, body);
      });
    });
  });

  it("should delete many entries", function () {
    let options = {
      hostname: "localhost",
      port: global.port,
      method: "PUT",
      path: "/api/entry/" + logID + "/",
      headers: {
        "Content-Type": "application/json",
        Cookie: global.cookie
      }
    };
    let entry = {
      date: date,
      data: data
    };
    return $http.request(options, JSON.stringify(entry)).then(function (res) {
      return res.getData().then(function (body) {
        assert.equal(res.statusCode, 200, body);

        let options = {
          hostname: "localhost",
          port: global.port,
          method: "DELETE",
          path: "/api/entry/" + logID + "/",
          headers: {
            Cookie: global.cookie
          }
        };
        return $http.request(options).then(function (res) {
          return res.getData().then(function (body) {
            assert.equal(res.statusCode, 200, body);
            let obj = JSON.parse(body);
            assert(obj.deletedCount);
          });
        });
      });
    });
  });
});
