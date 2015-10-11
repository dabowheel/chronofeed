function getTemplateSource(name,saveList) {
  return new Promise(function (resolve) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState==4 && request.status==200) {
        saveList[name] = request.responseText;
        resolve();
      }
    };

    request.open("GET","views/" + name + ".html",true);
    request.send();
  });
}
