function loadPosts() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState==4 && request.status==200) {
      var list = JSON.parse(request.responseText);
      console.log(request.responseText);
      console.log(list);
      document.getElementById("posts").innerHTML = postList2HTML(list);
    }
  };
  request.open("GET","load_posts.php",true);
  request.send();
}

function loadPost(id) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState==4 && request.status==200) {
      var post = JSON.parse(request.responseText);
      console.log(request.responseText);
      console.log(post);
      displayPost(post);
    }
  };
  request.open("GET","load_post.php?id=" + id,true);
  request.send();
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
    var html = "<div><strong>" + post.title + "</strong><span class=\"listbutton\"><button onclick=\"editPost('" + post.id + "');\">Edit</button><button>Delete</button></span></div>";
    html += "<div>" + post.text + "</div>";
    html += "<div>" + post.date + "</div>";
    return html;
}

function editPost(id) {
  console.log("edit post " + id);
  document.getElementById("post" + id).innerHTML = editPost2HTML(id);
}

function displayPost(post) {
  document.getElementById("post" + post.id).innerHTML = displayPost2HTML(post);
}

function editPost2HTML(id) {
  var html = "<div><strong>Edit</strong></div>";
  html += "<div><input id=\"posttitle\" type=\"text\" style=\"width:100%;box-sizing:border-box;\"/></div>";
  html += "<div><textarea id=\"posttext\" rows=\"5\" style=\"width:100%;box-sizing:border-box;\"></textarea></div>";
  html += "<div><span><button class=\"fillerbutton\">Here</button></span><span class=\"listbutton\"><button onclick=\"savePostChanges('" + id + "');\">Accept</button><button onclick=\"cancelPostChanges('" + id + "')\">Cancel</button></span></div>";
  return html;
}

function message(str) {
  document.getElementById("message").innerHTML = str;
}

function savePostChanges(id) {

}

function cancelPostChanges(id) {

}


function savePost2() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState==4 && request.status==200) {
      message(request.responseText);
      loadPosts();
    }
  };
  request.open("POST","save_post.php",true);
  request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  var titleElement = document.getElementById("title");
  var title = encodeURIComponent(titleElement.value);
  titleElement.value = "";
  
  var textElement = document.getElementById("text");
  var text = encodeURIComponent(textElement.value);
  textElement.value = "";
  request.send("title=" + title + "&text=" + text + "&r=" + Math.random());
}

