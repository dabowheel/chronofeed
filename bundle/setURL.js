module.exports = function (url,title,replace) {
  url = encodeURI(url);
  if (url != (location.pathname + location.search)) {
    if (!title) {
      title = document.title;
    }
    if (replace || url == "/") {
      history.replaceState("", title, url + location.search);
    } else {
      history.pushState("", title, url + location.search);
    }
    document.title = title;
  }
}
