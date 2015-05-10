function deletePostWeb(id,callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState==4 && request.status==200) {
      console.log(request.responseText);
      var status = JSON.parse(request.responseText);
      console.log(request.responseText);
      console.log(post);
      callback(status);
    }
  };
  request.open("GET","delete_post.php?id=" + id,true);
  request.send();
}