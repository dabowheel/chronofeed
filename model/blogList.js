var modelBlog = require("./blog");

function BlogList() {
  this.list = [];
  this.maxDOMID = 0;
}
BlogList.prototype.getDOMID = function () {
  return (++this.maxDOMID).toString();
};
BlogList.prototype.loadObject = function (obj) {
  if (obj && obj.list && obj.list.length) {
    for (var i = 0; i < obj.list.length; i++) {
      var values = obj.list[i];
      this.list[this.list.length] = new modelBlog.BlogInfo(values._id, values.title, this.getDOMID());
    }
  }
};
BlogList.prototype.exportObject = function () {
  var ret = {
    list: []
  };

  for (var blogInfo of this.list) {
    ret.list.push(blogInfo.exportObject());
  }

  return ret;
};
BlogList.prototype.getBlogInfo = function (domID) {
  for (var i = 0; i < this.list.length; i++) {
    if (this.list[i].domID == domID) {
      return this.list[i];
    }
  }
};
BlogList.prototype.add = function (blogInfo) {
  this.list.push(blogInfo);
};
BlogList.prototype.sort = function () {
  this.list.sort(function (a,b) {
    if (a.title < b.title)
      return -1;
    if (a.title > b.title)
      return 1;
    return 0;
  });
};
BlogList.prototype.hasTitle = function (title) {
  for (var i = 0; i < this.list.length; i++) {
    if (this.list[i].title == title)
      return true;
  }
  return false;
};
BlogList.prototype.getNewTitle = function () {
  var title;
  for (var i = 1; true; i++) {
    if (i == 1) {
      title = "New Blog";
    } else {
      title = "New Blog " + i.toString();
    }
    if (!this.hasTitle(title)) {
      return title;
    }
  }
};
BlogList.prototype.delete = function (domID) {
  for (var i = 0; i < this.list.length; i++) {
    if (this.list[i].domID == domID) {
      var blogInfo = this.list[i];
      this.list.splice(i,1);
      return blogInfo;
    }
  }
  return null;
};

exports.BlogList = BlogList;
