"use strict";
class Component {
  constructor (containerID) {
    this.containerID = containerID;
  }
  render() {
    return "";
  }
  afterLoad() {}
  show () {
    if (this.containerID) {
      this.render(function (err,view) {
        if (err) {
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
}

module.exports = Component;
