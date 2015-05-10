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
