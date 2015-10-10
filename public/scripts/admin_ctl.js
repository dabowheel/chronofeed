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

    displayAdmin(res);
  });
}
