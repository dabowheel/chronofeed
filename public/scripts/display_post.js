function displayPosts() {
  loadPosts(function (list) {
    document.getElementById("posts").innerHTML = postList2HTML(list);
  });
}

function postList2HTML(list) {
  var html = "<div class=\"postlist\">";
  for (var i = 0; i < list.length; i++) {
    var post = list[i];
    var postID = "post" + post.id;
    html += "<div id=\"" + postID + "\" class=\"post\">";
    html += displayPost2HTML(post);
    html += "</div>";
  }
  html += "</div>"
  return html;
};

function displayPost2HTML(post) {
    var html = "<div><strong>" + post.title + "</strong><span class=\"listbutton\"><button onclick=\"editPost('" + post.id + "');\">Edit</button><button onclick=\"deletePost('" + post.id + "')\">Delete</button></span></div>";
    html += "<div>" + post.text + "</div>";
    html += "<div>" + post.date + "<button class=\"hiddenbutton\">Button to float against</button></div>";
    return html;
}

function displayPost(post) {
  document.getElementById("post" + post.id).innerHTML = displayPost2HTML(post);
}
