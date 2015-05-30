function getTemplateSource(name,saveList) {
  return new Promise(function (resolve) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState==4 && request.status==200) {
        console.log(request.responseText);
        saveList[name] = request.responseText;
        resolve();
      }
    };

    request.open("GET","template/" + name + ".html",true);
    request.send();
  });
}
