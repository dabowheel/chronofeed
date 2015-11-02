"use strict";
var view = require("./admin.html");
var menuView = require("./menu.html");
var datastore = require("../scripts/datastore");
var modelUserList = require("../model/userList");
var page = require("../scripts/page");

function getAdmin(callback) {
  if (cache.userList && cache.expiredTable) {
    return callback();
  }

  datastore("GET", "userList", null, function (err,res) {
    if (err) {
      return callback(err);
    }

    cache.userList = new modelUserList.UserList();
    cache.userList.loadObject(res);

    datastore("GET", "getExpiredTable", null, function (err, res) {
      if (err) {
        return callback(err);
      }

      cache.expiredTable = res;
      callback();
    });
  });
}

function displayAdmin(userList,expiredTable) {
  var template = Handlebars.compile(menuView);
  var menuHTML = template({isAdmin: true});
  template = Handlebars.compile(view);
  var adminHTML = template({userList:userList, expiredTable:expiredTable});
  document.getElementById("main").innerHTML = menuHTML + adminHTML;
}

function viewAdmin() {
  getAdmin(function (err) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    page.setURL("/admin", "Grackle | Admin");
    displayAdmin(cache.userList, cache.expiredTable);
  });
}

function confirmDeleteUser(_id) {
  var user = cache.userList.getUser(_id);
  $("#deleteHeader").html("Delete " + user.username);
  document.getElementById("deleteButton").onclick = function () {
    deleteUser(_id);
  };
  $("#deleteModal").modal("show");
}

function deleteUser(_id) {
  var obj = {
    _id: _id
  };
  datastore("DELETE", "deleteUser", obj, function (err, obj) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    cache.userList.delete(_id);
    displayAdmin(cache.userList);
  });
}

function makeClickCleanup(apiPath,dbName) {
  return function () {
    datastore("DELETE", apiPath, null, function (err, obj) {
      if (err) {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
        return;
      }

      $("#placeForAlert").removeClass("alert-warning");
      $("#placeForAlert").addClass("alert alert-success");
      $("#placeForAlert").html(dbName + " records deleted: " + obj.count);
    });
  };
}

global.clickCleanupReset = makeClickCleanup("cleanupReset", "Reset");
global.clickCleanupVerify = makeClickCleanup("cleanupVerify", "Verify Email");

exports.viewAdmin = viewAdmin;
exports.setGlobals = function () {
  global.deleteUser = deleteUser;
  global.confirmDeleteUser = confirmDeleteUser;
};
