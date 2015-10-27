function MVC(view,containerID) {
  this.view = view;
  this.containerID = containerID;
}
MVC.prototype.beforeLoad = function () {};
MVC.prototype.afterLoad = function () {};
MVC.prototype.show = function () {
  this.beforeLoad();
  document.getElementById(this.containerID).innerHTML = this.view;
  this.afterLoad();
};

exports.MVC = MVC;
