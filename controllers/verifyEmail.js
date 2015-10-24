var datastore = require("../scripts/datastore");
var views = require("../scripts/views");

function displayVerifyEmail(verified) {
  var template = Handlebars.compile(views.list.verifyEmail);
  document.getElementById("main").innerHTML = template({verified: verified});
}

function viewVerifyEmail(hash,code) {
  datastore("GET","verifyEmail/" + hash + "/" + code, null, function (err,res) {
    var verified = true;
    if (err) {
      verified = false;
    }
    displayVerifyEmail(verified);
    if (err) {
      $("#placeForAlert").addClass("alert alert-warning");
      $("#placeForAlert").html(err);
    }
  });
}

exports.viewVerifyEmail = viewVerifyEmail;
