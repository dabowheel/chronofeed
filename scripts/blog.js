function error(message) {
  console.error(message, "\n", (new Error()).stack);
}

function Post(domID,postID,title,text,date) {
  if (typeof domID == "string" || domID instanceof String) {
    this.domID = domID
  } else {
    error("invalid domID: " + domID);
  }

  if (typeof postID == "string" || postID instanceof String) {
    this.postID = postID;
  } else {
    error("invalid postID: " + postID);
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
  } else {
    error("invalid date: " + date);
  }
};
Post.prototype.loadObject = function (post) {
  this.Post(post.domID, post.postID, post.title, post.text, post.date);
};

function Blog(blogID,title) {
  this.blogID = blogID?blogID:"";
  this.title = title?title:"";
  this.postList = [];
  this.editNew = false;
  this.editID = "";
  this.maxPostDOMID = 0;
}
Blog.prototype.getDOMID = function () {
  return (++this.maxPostDOMID).toString();
}
Blog.prototype.appendObjectPost = function (post,domID) {
  this.postList[this.postList.length] = new Post(domID,post.postID,post.title,post.text,new Date(post.date));
};
Blog.prototype.loadObject = function (obj) {
  if (obj.id) {
    this.id = obj.id;
  }
  if (obj.title) {
    this.title = obj.title;
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
Blog.prototype.editPost = function (domID,post) {
  for (var i = 0; i < this.postList.length; i++) {
    var p = this.postList[i];
    if (p.domID === domID) {
      p.title = post.title;
      p.text = post.text;
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
}
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
