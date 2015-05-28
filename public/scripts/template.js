function getTemplateSource(name,callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState==4 && request.status==200) {
      console.log(request.responseText);
      callback(request.responseText);
    }
  };

  request.open("GET","template/" + name + ".html",true);
  request.send();
}
