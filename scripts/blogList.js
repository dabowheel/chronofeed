function BlogInfo(blogID,title) {
  if (typeof blogID == "string" || blogID instanceof String) {
    this.blogID = blogID;
  } else {
    error("Invalid blogID: " + blogID);
  }

  if (typeof title == "string" || title instanceof String) {
    this.title = title;
  } else {
    error("Invalid title: " + title);
  }
}
BlogInfo.prototype.loadObject = function (obj) {
  this.Blog(obj.blogID,obj.title);
};
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
