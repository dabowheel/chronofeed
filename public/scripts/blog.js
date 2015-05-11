function Post(id,title,text,date) {
  this.id = id?id:"";
  this.title = title?title:"";
  this.text = text?text:"";
  this.date = date?date:"";
}

function Blog(id,title) {
  this.id = id?id:"";
  this.title = title?title:"";
  this.postList = [];
  this.editing = false;
  this.editNew = false;
  this.editID = "";
}
Blog.prototype.addPost = function (post) {
  this.postList[this.postList.length] = new Post(post.id,post.title,post.text,post.date);
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
      this.addPost(obj.postList[i]);
    }
  }
};