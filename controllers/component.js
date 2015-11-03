"use strict";
class Component {
  constructor (view,containerID) {
    this.view = view;
    this.containerID = containerID;
  }
  beforeLoad() {}
  afterLoad() {}
  show () {
    this.beforeLoad();
    document.getElementById(this.containerID).innerHTML = this.view;
    this.afterLoad();
  }
  global() {
    if (!global.component) {
      global.component = {};
    }
    global[this.constructor.name] = this;
  }
}

module.exports = Component;
