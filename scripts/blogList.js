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
      this.list[this.list.length] = new BlogInfo(this.getDOMID(),values.blogID,values.title);
    }
  }
};
BlogList.prototype.getBlogInfo = function (domID) {
  for (var i = 0; i < this.list.length; i++) {
    if (this.list[i].domID == domID) {
      return this.list[i];
    }
  }
};
BlogList.prototype.add = function (blogInfo) {
  this.list.unshift(blogInfo);
  this.sort();
};
BlogList.prototype.sort = function () {
  this.list.sort(function (a,b) {
    if (a.title < b.title)
      return -1
    if (a.title > b.title)
      return 1
    return 0
  })
};
BlogList.prototype.hasTitle = function (title) {
  for (var i = 0; i < this.list.length; i++) {
    if (this.list[i].title == title)
      return true;
  }
  return false;
}
BlogList.prototype.getNewTitle = function () {
  var title;
  for (var i = 0; true; i++) {
    if (i == 0) {
      title = "New Blog";
    } else {
      title = "New Blog " + i.toString();
    }
    if (!this.hasTitle(title)) {
      return title;
    }
  }
}