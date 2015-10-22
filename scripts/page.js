function setHash(hash) {
  if (this.hash != location.hash) {
    location.hash = this.hash;
  }
}

function setURL(url,title) {
  if (this.url != (location.pathname + location.search)) {
    if (!title) {
      title = document.title;
    }
    if (url != "/") {
      url = "/" + url;
    }
    console.log("setting url", url);
    history.pushState("", title, url);
    document.title = title;
  }
}

exports.setHash = setHash;
exports.setURL = setURL;
