function logout() {
  datastore("GET", "logout", null, function (err,res) {
    if (err) {
      $("#menuPlaceForAlert").addClass("alert alert-warning");
      $("#menuPlaceForAlert").html(err);
      return;
    }

    g_userID = "";
    if (location.hash) {
      location.hash = "";
    }
    viewSplash();
  });
}
