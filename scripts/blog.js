
function Post(domID,postID,title,text,date,blogID) {
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

  if (typeof blogID == "string" || blogID instanceof String) {
    this.blogID = blogID;
  } else {
    error("invalid blogID: " + blogID);
  }
};
Post.prototype.loadObject = function (post) {
  this.Post(post.domID, post.postID, post.title, post.text, post.date, post.blogID);
};

function Blog(blogID,title) {
  if (typeof blogID == "string" || blogID instanceof String) {
    this.blogID = blogID;
  } else {
    error("invalid blogID: " + blogID);
  }

  if (typeof title == "string" || title instanceof String) {
    this.title = title;
  } else {
    error("invalid title: " + title);
  }

  this.postList = [];
  this.editNew = false;
  this.editID = "";
  this.editBlogTitle = false;
  this.maxPostDOMID = 0;
}
Blog.prototype.getDOMID = function () {
  return (++this.maxPostDOMID).toString();
}
Blog.prototype.appendObjectPost = function (post,domID) {
  this.postList[this.postList.length] = new Post(domID,post.postID,post.title,post.text,new Date(Date(post.date)),post.blogID);
};
Blog.prototype.loadObject = function (obj) {
  if (obj.blogID) {
    this.blogID = obj.blogID;
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
};
Blog.prototype.updateBlogID = function(blogID) {
  if (typeof blogID == string || blogID instanceof String) {
    if (this.blogID == "") {
      this.blogID = blogID;
      for (var i = 0; i < this.postList.length; i++) {
        this.postList[i].blogID = blogID;
      }
    }
  } else {
    error("Invalid blogID: " + blogID);
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
      return -1
    if (a.title > b.title)
      return 1
    return 0
  });
};

function BlogInfo(domID,blogID,title) {
  if (typeof domID == "string" || domID instanceof String) {
    this.domID = domID
  } else {
    error("Invalid domID: " + domID);
  }

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