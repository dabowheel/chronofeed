function displayBlogList2HTML(blogList) {
  var html = "<div id=\"blogmessage\"><div>";
  html += "<button onclick=\"addPost();\">Add</button>"

  html += "<div class=\"postlist\">";
  for (var i = 0; i < blogList.list.length; i++) {
    var blog = blogList.list[i];
    html += "<div class=\"post\">";
    html += displayBlogInfo2HTML(post);
    html += "</div>";
  }  
  html += "</div>"

  return html;
};

function displayBlogInfo2HTML(post) {
  var html = "<div><strong>" + post.title + "</strong><span class=\"listbutton\"><button onclick=\"editBlogName('" + post.id + "');\">Edit</button><button onclick=\"deleteBlog('" + post.id + "')\">Delete</button></span></div>";
  html += "<div>" + post.text + "</div>";
  html += "<div>" + post.date + "<button class=\"hiddenbutton\">Button to float against</button></div>"; 
  return html;
}