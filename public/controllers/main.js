var g_templateList = [];

function getStack() {
  return (new Error()).stack;
}

function error(message) {
  console.error(message, "\n", getStack());
}

function loadAll() {
  loadAssetsFromServer(function () {
    viewInitial();
  });
}

function viewInitial() {
  if (location.hash == "#login") {
    viewLogin();
  } else if (location.hash == "#signup") {
    viewSignup();
  } else if (location.hash == "#admin") {
    viewAdmin();
  } else {
    datastore("GET", "session", null, function (err,res) {
      if (err) {
        error(err);
        viewSplash();
        return;
      }
      if (res.userID) {
        viewBlogList();
      } else {
        viewSplash();
      }
    });
  }
}

window.onhashchange = function () {
  console.log("hash change")
  viewInitial();
};

function loadAssetsFromServer(callback) {
  var promiseList = [];
  var names = ["admin","blog","blogList","login","menu","signup","splash"];
  for (var i in names) {
    promiseList[promiseList.length] = getTemplateSource(names[i],g_templateList);
  }

  p = Promise.all(promiseList);
  p.then(function (val) {
    callback();
  });
}
