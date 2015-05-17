requirejs(["scripts/blog.js","scripts/blog_ctl.js","scripts/datastore.js"], function() {
  loadBlogFromServer(1);
});
