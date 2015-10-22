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
    history.pushState("", title, url);
    console.log("setting url", url);
  }
}

exports.setHash = setHash;
exports.setURL = setURL;
