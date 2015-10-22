var views = require("../scripts/views");
var datastore = require("../scripts/datastore");
var modelUserList = require("../model/userList");
var modelData = require("../model/data");
var page = require("../scripts/page");

function displayAdmin(adminList) {
  var template = Handlebars.compile(views.list.menu);
  var menuHTML = template({username:modelData.username, isAdmin: true});
  template = Handlebars.compile(views.list.admin);
  var adminHTML = template(adminList);
  document.getElementById("main").innerHTML = menuHTML + adminHTML;
}

function getAdmin(callback) {
  if (modelData.UserList) {
    return callback();
  }

  datastore("GET", "userList", null, function (err,res) {
    if (err) {
      return callback(err);
    }

    modelData.userList = new modelUserList.UserList();
    modelData.userList.loadObject(res);
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

    console.log("user list", modelData.userList);
    page.setURL("/admin", "Grackle | Admin");
    displayAdmin(modelData.userList);
  });
}

function deleteUser(id) {
  var obj = {
    id: id
  };
  datastore("DELETE", "deleteUser", obj, function (err, obj) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    console.log("global",modelData.userList);
    console.log("delete user",id);
    modelData.userList.delete(id);
    console.log("global",modelData.userList);
    displayAdmin(modelData.userList);
  });
}

exports.viewAdmin = viewAdmin;
exports.setGlobals = function () {
  global.deleteUser = deleteUser;
};
