function displayBlogList2HTML(blogList) {
  var html = "<div id=\"bloglistmessage\"><div>";
  html += "<button onclick=\"addBlog();\">Add</button>"

  html += "<div class=\"blogList\">";
  for (var i = 0; i < blogList.list.length; i++) {
    var blog = blogList.list[i];
    html += "<div class=\"blogInfo\">";
    html += displayBlogInfo2HTML(blog);
    html += "</div>";
  }  
  html += "</div>"

  return html;
};

function displayBlogInfo2HTML(blog) {
  var html = "<div><strong>" + blog.title + "</strong><span class=\"listbutton\"><button onclick=\"editBlog('" + blog.domID + "');\">Edit</button><button onclick=\"deleteBlog('" + blog.domID + "')\">Delete</button></span></div>";
  return html;
}

function displayBlogList(blogList) {
  document.getElementById("main").innerHTML = displayBlogList2HTML(blogList);
}

function loadBlogListFromServer() {
  
}

function addBlog() {

}

function editBlog(domID) {

}

function deleteBlog(domID) {

}
