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

module.exports = Component;
