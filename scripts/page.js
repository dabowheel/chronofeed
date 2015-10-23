function setHash(hash) {
  if (this.hash != location.hash) {
    location.hash = this.hash;
  }
}

function setURL(url,title) {
  if (url != (location.pathname + location.search)) {
    if (!title) {
      title = document.title;
    }
    if (url == "/") {
      history.replaceState("", title, url + location.search);
    } else {
      history.pushState("", title, url + location.search);
    }
    document.title = title;
  }
}

exports.setHash = setHash;
exports.setURL = setURL;
