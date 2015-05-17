function BlogList() {
  this.list = [];
}
BlogList.prototype.loadObject = function (obj) {
  if (obj && obj.list && obj.list.length) {
    for (var i = 0; i < obj.list.length; i++) {
      var blogInfo = new BlogInfo("","");
      blogInfo.loadObject(obj.list[i]);
      this.list[this.list.length] = blogInfo;
    }
  }
}
