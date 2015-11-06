"use strict";

class Component {
  constructor (containerID,documentTitle) {
    this.containerID = containerID;
    this.documentTitle = documentTitle;
  }
  render() {
    return "";
  }
  afterLoad() {}
  show () {
    if (this.containerID) {
      this.render(function (err,view) {
        if (err) {
          if (view) {
            view.show();
          }
          return;
        }
        document.getElementById(this.containerID).innerHTML = view;
        this.afterLoad();
      }.bind(this));
    }
  }
  global() {
    if (!global.component) {
      global.component = {};
    }
    global.component[this.constructor.name] = this;
  }
  getPathComponent() {
    return global.compPath[decodeURI(location.pathname)];
  }
  setPathComponent(c) {
    global.compPath[decodeURI(location.pathname)] = c;
  }
}

module.exports = Component;
