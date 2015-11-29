"use strict";
let timelog = require("./timelog");

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
      timelog.addEvent("before render");
      this.render(function (err,view) {
        if (err) {
          if (view) {
            view.show();
          }
          return;
        }
        this.beforeLoad();
        timelog.addEvent("before insert HTML");
        document.getElementById(this.containerID).innerHTML = view;
        timelog.addEvent("after insert HTML");
        this.afterLoad();
        timelog.addEvent("after afterLoad");
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
