var views = require("../scripts/views");

function viewSplash() {
  document.getElementById("main").innerHTML = views.list.splash;
}

exports.viewSplash = viewSplash;
