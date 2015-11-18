"use strict";

class Component {
  constructor (containerID,documentTitle) {
    this.containerID = containerID;
    this.documentTitle = documentTitle;
  }
  render() {
    return "";
  }
  beforeLoad() {}
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
        this.beforeLoad();
        document.getElementById(this.containerID).innerHTML = view;
        this.afterLoad();
      }.bind(this));
    }
  }
  leave() {}
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
