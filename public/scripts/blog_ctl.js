function displayBlog2HTML(blog) {
  var html = "<button onclick=\"addPost();\">Add</button>"
  html += "<div class=\"postlist\">";

  // new post
  if (blog.editNew) {
    var post = new Post();
    html += "<div id=\"post\" class=\"post\">";
    html += editPost2HTML(post);
    html += "</div>";
  }

  for (var i = 0; i < blog.postList.length; i++) {
    var post = blog.postList[i];
    html += "<div class=\"post\">";
    if (post.id === blog.editID) {
      html += editPost2HTML(post);
    } else {
      html += displayPost2HTML(post);
    }
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

function editPost2HTML(post) {
  var html = "<div><strong>Edit</strong></div>";
  html += "<div><input id=\"postid\" type=\"hidden\" value=\"" + post.id + "\"/><div>";
  html += "<div><input id=\"posttitle\" type=\"text\" style=\"width:100%;box-sizing:border-box;\" value=\"" + post.title + "\"/></div>";
  html += "<div><textarea id=\"posttext\" rows=\"5\" style=\"width:100%;box-sizing:border-box;\">"+ post.text + "</textarea></div>";
  html += "<div><span><button class=\"fillerbutton\">Here</button></span><span class=\"listbutton\"><button class=\"savebutton\" onclick=\"savePostChanges('" + post.id + "');\">Accept</button><button class=\"savebutton\" onclick=\"cancelPostChanges('" + post.id + "')\">Cancel</button></span></div>";
  return html;
}

function getPost() {
  return {
    id: document.getElementById("postid").value,
    title: document.getElementById("posttitle").value,
    text: document.getElementById("posttext").value
  };
}

function displayBlog(blog) {
  document.getElementById("blog").innerHTML = displayBlog2HTML(blog);
}

function refreshBlog() {
  loadBlogWeb(function (blog) {
    displayBlog(blog);
  });  
}

function addPost() {
  loadBlogWeb(function (blog) {
    blog.editNew = true;
    displayBlog(blog);
  });
}

function savePostChanges(id) {
  var post = getPost();

  savePostWeb(post,function (status) {
    if (status.success) {
      refreshBlog();
      message("Saved.");
    } else {
      refreshBlog();
      message(status.message);
    }
  });
}

function cancelPostChanges(id) {
  refreshBlog();
}

function editPost(id) {
  loadBlogWeb(function (blog) {
    blog.editID = id;
    displayBlog(blog);
  })
}

function deletePost(id) {
  deletePostWeb(id,function (obj) {
    if (obj.success) {
      refreshBlog();
      message("Deleted.");
    } else {
      message(obj.error);
    }
  });
}