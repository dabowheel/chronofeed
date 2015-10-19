var modelPost = require("./post");

function Blog(_id,title) {
  this._id = _id;
  this.title = title;

  this.postList = [];
  this.editNew = false;
  this.editID = "";
  this.editBlogTitle = false;
  this.maxPostDOMID = 0;
}
Blog.prototype.getDOMID = function () {
  return (++this.maxPostDOMID).toString();
};
Blog.prototype.appendObjectPost = function (obj) {
  var post = new modelPost.Post();
  post.loadObject(obj);
  this.postList[this.postList.length] = post;
};
Blog.prototype.loadObject = function (obj) {
  this._id = obj._id;
  this.title = obj.title;

  if (obj && obj.postList && obj.postList.length) {
    for (var post of obj.postList) {
      this.appendObjectPost(post);
    }
  }
};
Blog.prototype.editTitle = function(title) {
  this.title = title;
};
Blog.prototype.addPost = function (post) {
  this.postList.unshift(post);
};
Blog.prototype.editPost = function (domID) {
  for (var i = 0; i < this.postList.length; i++) {
    if (this.postList[i].domID == domID) {
      this.postList[i].edit = true;
      break;
    }
  }
};
Blog.prototype.stopEditingPost = function (domID) {
  for (var i = 0; i < this.postList.length; i++) {
    if (this.postList[i].domID == domID) {
      this.postList[i].edit = false;
      break;
    }
  }
};
Blog.prototype.savePost = function (domID,post) {
  for (var i = 0; i < this.postList.length; i++) {
    if (this.postList[i].domID === domID) {
      this.postList[i] = post;
      break;
    }
  }
};
Blog.prototype.deletePost = function (domID) {
  for (var i = 0; i < this.postList.length; i++) {
    var post = this.postList[i];
    if (post.domID === domID) {
      this.postList.splice(i,1);
      return post;
    }
  }
  return null;
};
Blog.prototype.getPost = function (domID) {
  for (var i = 0; i < this.postList.length; i++) {
    var post = this.postList[i];
    if (post.domID == domID) {
      return post;
    }
  }
};
Blog.prototype.sort = function (reverse) {
  this.postList.sort(function (a,b) {
    if (reverse) {
      if (a.date < b.date)
        return 1;
      if (a.date > b.date)
        return -1;
      return 0;
    } else {
      if (a.date < b.date)
        return -1;
      if (a.date > b.date)
        return 1;
      return 0;
    }
  });
};

function BlogInfo(_id,title,domID) {
  this._id = _id;
  this.title = title;
  this.domID = domID;
}
BlogInfo.prototype.exportObject = function () {
  return {
    _id: this._id,
    title: this.title
  };
};
BlogInfo.prototype.loadObject = function (obj) {
  this._id = obj._id;
  this.title = obj.title;
};

exports.Blog = Blog;
exports.BlogInfo = BlogInfo;
