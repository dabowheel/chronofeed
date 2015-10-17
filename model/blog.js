function getInputDateValue(d) {
  return d.getFullYear() + "-" + ((d.getMonth()+1)<10?"0":"") + (d.getMonth()+1) + "-" + (d.getDate()<10?"0":"") + d.getDate();
}
function getInputTimeValue(d) {
  return ((d.getHours()<10)?"0":"") + d.getHours() + ":" + ((d.getMinutes()<10)?"0":"") + d.getMinutes();
}
function toDateString(d) {
  return d.toLocaleDateString() + " " + d.toLocaleTimeString(navigator.language,{hour:"2-digit",minute:"2-digit"});
}
function toDBDateString(d) {
  return getInputDateValue(d) + " " + getInputTimeValue(d);
}

function Post(domID,postID,title,text,date,blogID,userID) {
  if (typeof domID == "string" || domID instanceof String) {
    this.domID = domID;
  } else {
    error("invalid domID: " + domID);
  }

  if (typeof postID == "number") {
    this.postID = postID;
  } else {
    error("invalid postID: " + postID + " type: " + (typeof postID));
  }

  if (typeof title == "string" || title instanceof String) {
    this.title = title;
  } else {
    error("invalid title: " + title);
  }

  if (typeof text == "string" || text instanceof String) {
    this.text = text;
  } else {
    error("invalid text: " + text);
  }

  if (date instanceof Date) {
    this.date = date;
    this.dateString = toDateString(this.date);
    this.dateOnly = getInputDateValue(this.date);
    this.timeOnly = getInputTimeValue(this.date);
    this.dbDateString = toDBDateString(this.date);
  } else {
    error("invalid date: " + date);
  }

  if (typeof blogID == "number") {
    this.blogID = blogID;
  } else {
    error("invalid blogID: " + blogID + " type: " + (typeof blogID));
  }

  if (typeof userID == "number") {
    this.userID = userID;
  } else {
    error("invalid userID: " + userID + " type: " + (typeof userID));
  }
}
Post.prototype.loadObject = function (post) {
  this.Post(post.domID, post.postID, post.title, post.text, post.date, post.blogID, post.userID);
};

function Blog(blogID,title,userID) {
  if (blogID) {
    if (typeof blogID == "number") {
      this.blogID = blogID;
    } else {
      error("invalid blogID: " + blogID + " type: " + (typeof blogID));
    }
  }

  if (title) {
    if (typeof title == "string" || title instanceof String) {
      this.title = title;
    } else {
      error("invalid title: " + title);
    }
  }

  if (userID) {
    if (typeof userID == "number") {
      this.userID = userID;
    } else {
      error("invalid userID: " + userID);
    }
  }

  this.postList = [];
  this.editNew = false;
  this.editID = "";
  this.editBlogTitle = false;
  this.maxPostDOMID = 0;
}
Blog.prototype.getDOMID = function () {
  return (++this.maxPostDOMID).toString();
};
Blog.prototype.appendObjectPost = function (post,domID) {
  this.postList[this.postList.length] = new Post(domID,post.postID,post.title,post.text,new Date(post.date),post.blogID,post.userID);
};
Blog.prototype.loadObject = function (obj) {
  if (obj.blogID) {
    this.blogID = obj.blogID;
  }
  if (obj.title) {
    this.title = obj.title;
  }

  if (obj.userID) {
    this.userID = obj.userID;
  }

  if (obj && obj.postList && obj.postList.length) {
    for (var i = 0; i < obj.postList.length; i++) {
      this.appendObjectPost(obj.postList[i], this.getDOMID());
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
Blog.prototype.updatePostID = function (domID,postID) {
  for (var i = 0; i < this.postList.length; i++) {
    var p = this.postList[i];
    if (p.domID === domID) {
      p.postID = postID;
      break;
    }
  }
};
Blog.prototype.updateBlogID = function(blogID) {
  if (typeof blogID == string || blogID instanceof String) {
    if (!this.blogID) {
      this.blogID = blogID;
      for (var i = 0; i < this.postList.length; i++) {
        this.postList[i].blogID = blogID;
      }
    }
  } else {
    error("Invalid blogID: " + blogID);
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
Blog.prototype.sort = function () {
  this.postList.sort(function (a,b) {
    if (a.title < b.title)
      return -1;
    if (a.title > b.title)
      return 1;
    return 0;
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
}

exports.Blog = Blog;
exports.BlogInfo = BlogInfo;
