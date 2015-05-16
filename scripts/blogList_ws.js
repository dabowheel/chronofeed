function loadBlogListWeb(blogID,callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState==4 && request.status==200) {
      console.log(request.responseText);
      var obj = JSON.parse(request.responseText);
      console.log(obj);
      if (obj.success) {
        var blogList = new BlogList("","");
        blogList.loadObject(obj);
        callback(blogList);
      } else {
        callback(null,obj.error);
      }
    }
  };
  request.open("GET","load_blogList.php",true);
  request.send();
}