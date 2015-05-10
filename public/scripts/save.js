function savePost(post,callback) {
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
