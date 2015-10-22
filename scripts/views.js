var list = [];

function getTemplateSource(name) {
  return new Promise(function (resolve) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState==4 && request.status==200) {
        list[name] = request.responseText;
        resolve();
      }
    };

    request.open("GET","/views/" + name + ".html",true);
    request.send();
  });
}

exports.getTemplateSource = getTemplateSource;
exports.list = list;
