"use strict";
function Component(view,containerID) {
  this.view = view;
  this.containerID = containerID;
}
Component.prototype.beforeLoad = function () {};
Component.prototype.afterLoad = function () {};
Component.prototype.show = function () {
  this.beforeLoad();
  document.getElementById(this.containerID).innerHTML = this.view;
  this.afterLoad();
};
Component.prototype.global = function (name) {
  if (!global.component) {
    global.component = {};
  }

  if (!global[this.constructor.name]) {
    global[this.constructor.name] = {};
  }

  global[this.constructor.name][name] = this[name];
};

module.exports = Component;
