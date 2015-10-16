var views = require("../scripts/views");
var datastore = require("../scripts/datastore");
var modelAdmin = require("../model/admin");

var g_userList;

function displayAdmin(adminList) {
  var menuHTML = views.list.menu;
  var template = Handlebars.compile(views.list.admin);
  var adminHTML = template(adminList);
  document.getElementById("main").innerHTML = menuHTML + adminHTML;
}

function viewAdmin() {
  datastore("GET", "admin/userList", null, function (err,res) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    g_userList = new modelAdmin.UserList();
    g_userList.loadObject(res);
    console.log("user list", g_userList);
    displayAdmin(g_userList);
  });
}

function deleteUser(id) {
  var obj = {
    id: id
  };
  datastore("DELETE", "admin/deleteUser", obj, function (err, obj) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    console.log("global",g_userList);
    console.log("delete user",id);
    g_userList.delete(id);
    console.log("global",g_userList);
    displayAdmin(g_userList);
  });
}

exports.viewAdmin = viewAdmin;
exports.setGlobals = function () {
  global.deleteUser = deleteUser;
}
