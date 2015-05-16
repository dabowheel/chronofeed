requirejs(["scripts/blog.js","scripts/blog_ctl.js","scripts/blog_ws.js"], function() {
  loadBlogFromServer(1);
});
