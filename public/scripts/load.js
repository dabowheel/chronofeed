function loadPosts(callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState==4 && request.status==200) {
      var list = JSON.parse(request.responseText);
      console.log(request.responseText);
      console.log(list);
      callback(list);
    }
  };
  request.open("GET","load_posts.php",true);
  request.send();
}

function loadPost(id,callback) {
  console.log("load post " + id);
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState==4 && request.status==200) {
      console.log(request.responseText);
      var post = JSON.parse(request.responseText);
      console.log(request.responseText);
      console.log(post);
      callback(post);
    }
  };
  request.open("GET","load_post.php?id=" + id,true);
  request.send();
}