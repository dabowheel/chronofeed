var g_templateList = [];

function getStack() {
  return (new Error()).stack;
}

function error(message) {
  console.error(message, "\n", getStack());
}

function viewInitial() {
  loadAssetsFromServer(function () {
    console.log("loaded templates");
    viewBlogList();
  });
}

function loadAssetsFromServer(callback) {
  var promiseList = [];
  var names = ["blog","blogList","login","menu","signup"];
  for (i in names) {
    console.log("load " + names[i]);
    promiseList[promiseList.length] = getTemplateSource(names[i],g_templateList)
  }

  p = Promise.all(promiseList)
  p.then(function (val) {
    callback()
  })

}
