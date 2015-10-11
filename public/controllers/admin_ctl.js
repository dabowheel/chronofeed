var g_userList;

function displayAdmin(adminList) {
  var template = Handlebars.compile(g_templateList.admin);
  document.getElementById("main").innerHTML = template(adminList);
}

function viewAdmin() {
  datastore("GET", "admin/userList", null, function (err,res) {
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
      return;
    }

    g_userList = new UserList();
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
