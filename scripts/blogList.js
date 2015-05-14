function BlogList() {
  this.list = [];
}
BlogList.prototype.add(id,title) {
  this.list[this.list.length] = new Blog(id,title);
}