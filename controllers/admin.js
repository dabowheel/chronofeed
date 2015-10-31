var views = require("../scripts/views");
var datastore = require("../scripts/datastore");
var modelUserList = require("../model/userList");
var page = require("../scripts/page");

function displayAdmin(adminList) {
  var template = Handlebars.compile(views.list.menu);
  var menuHTML = template({isAdmin: true});
  template = Handlebars.compile(views.list.admin);
  var adminHTML = template(adminList);
  document.getElementById("main").innerHTML = menuHTML + adminHTML;
}

function getAdmin(callback) {
  if (cache.UserList) {
    return callback();
  }

  datastore("GET", "userList", null, function (err,res) {
    if (err) {
      return callback(err);
    }

    cache.userList = new modelUserList.UserList();
    cache.userList.loadObject(res);
    callback();
  });
}

function viewAdmin() {
  getAdmin(function (err) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    page.setURL("/admin", "Grackle | Admin");
    displayAdmin(cache.userList);
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

global.clickCleanupReset = function () {
  datastore("DELETE", "cleanupReset", null, function (err, obj) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    $("#placeForAlert").removeClass("alert-warning");
    $("#placeForAlert").addClass("alert alert-success");
    $("#placeForAlert").html("Reset records deleted: " + obj.count);
  });
};

exports.viewAdmin = viewAdmin;
exports.setGlobals = function () {
  global.deleteUser = deleteUser;
  global.confirmDeleteUser = confirmDeleteUser;
};
