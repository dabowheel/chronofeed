"use strict";

function setHash(hash) {
  if (hash != location.hash) {
    location.hash = hash;
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
