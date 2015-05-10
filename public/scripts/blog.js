function Post(id,title,text,date) {
  this.id = id?id:"";
  this.title = title?title:"";
  this.text = text?text:"";
  this.date = date?date:"";
}

function Blog(obj) {
  this.postList = [];
  this.editing = false;
  this.editNew = false;
  this.editID = "";
  if (obj && obj.postList && obj.postList.length) {
    for (var i = 0; i < obj.postList.length; i++) {
      this.addPost(obj.postList[i]);
    }
  }
}
Blog.prototype.addPost = function (post) {
  this.postList[this.postList.length] = new Post(post.id,post.title,post.text,post.date);
};
