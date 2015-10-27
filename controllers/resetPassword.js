var validate = require("../scripts/validate");
var mvc = require("./mvc");

function Page(view,containerID,hash,code) {
  mvc.MVC.call(this, view, containerID);
  this.hash = hash;
  this.code = code;
}
Page.prototype = new mvc.MVC();
Page.prototype.beforeLoad = function () {
  document.title = "Grackle | Reset Password";
};
Page.prototype.afterLoad = function () {
  document.getElementById("inputPassword").focus();
  validate.listenToFields(["inputPassword"], "submitButton");
};

global.clickSubmitPasswordReset = function () {

};

exports.Page = Page;
