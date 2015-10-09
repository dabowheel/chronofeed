var g_templateList = [];

function getStack() {
  return (new Error()).stack;
}

function error(message) {
  console.error(message, "\n", getStack());
}

function loadAll() {
  loadAssetsFromServer(function () {
    console.log("loaded templates");
    viewInitial();
  });
}

function viewInitial() {
  console.log("hash is",location.hash);
  if (location.hash == "#login") {
    viewLogin();
  } else if (location.hash == "#signup") {
    viewSignup();
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
  var names = ["blog","blogList","login","menu","signup","splash"];
  for (var i in names) {
    console.log("load " + names[i]);
    promiseList[promiseList.length] = getTemplateSource(names[i],g_templateList);
  }

  p = Promise.all(promiseList);
  p.then(function (val) {
    callback();
  });
}
