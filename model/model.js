var dateUtil = require("./dateUtil");

function Model() {
}
Model.prototype.schema = {};
Model.prototype.exportObject = function () {
  var ret = {};
  for (var name in this.schema) {
    if (this.schema[name] == Date) {
      ret[name] = dateUtil.toDateString(this[name]);
    } else {
      ret[name] = this[name];
    }
  }
  return ret;
};
Model.prototype.loadObject = function (obj) {
  for (var name in this.schema) {
    if (this.schema[name] == Date) {
      this[name] = new Date(obj[name]);
    } else {
      this[name] = obj[name];
    }
  }
  if (this.postLoad) {
    this.postLoad();
  }
};

exports.Model = Model;
