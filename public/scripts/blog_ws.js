function loadBlogWeb(callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState==4 && request.status==200) {
      var obj = JSON.parse(request.responseText);
      var blog = new Blog();
      blog.loadObject(obj);
      console.log(request.responseText);
      console.log(blog);
      callback(blog);
    }
  };
  request.open("GET","load_blog.php",true);
  request.send();
}

function loadPostWeb(id,callback) {
  console.log("load post " + id);
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState==4 && request.status==200) {
      console.log(request.responseText);
      var status = JSON.parse(request.responseText);
      console.log(request.responseText);
      console.log(status);
      callback(status);
    }
  };
  request.open("GET","load_post.php?id=" + id,true);
  request.send();
}


function savePostWeb(post,callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState==4 && request.status==200) {
      var status = JSON.parse(request.responseText);
      callback(status);
    }
  };

  if (post.id) {
    request.open("POST","update_post.php",true);
    request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    request.send("id=" + post.id + "&title=" + post.title + "&text=" + post.text);
  } else {
    request.open("POST","create_post.php",true);
    request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    request.send("title=" + post.title + "&text=" + post.text);
  }
}

function deletePostWeb(id,callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState==4 && request.status==200) {
      console.log(request.responseText);
      var status = JSON.parse(request.responseText);
      console.log(request.responseText);
      console.log(status);
      callback(status);
    }
  };
  request.open("GET","delete_post.php?id=" + id,true);
  request.send();
}