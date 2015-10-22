function datastore(method,path,obj,callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState==4) {
      console.log("request.status",request.status);
      console.log("request.responseText",request.responseText);
      if (request.status==200) {
        console.log(method,path,obj);
        console.log(request.responseText);
        var res;
        if (request.responseText === "") {
          callback(null,null);
        } else {
          try {
            res = JSON.parse(request.responseText);
          } catch(e) {
            callback("JSON parse error: " + e);
            return;
          }
          console.log(res);
          callback(null,res);
        }
      } else {
        console.log("before err callback");
        callback(request.responseText);
        console.log("after err callback");
      }
    }
  };

  request.open(method,"/datastore/" + path,true);
  if (method == "GET") {
    request.send();
  } else {
    request.setRequestHeader("Content-type","application/json");
    var body = JSON.stringify(obj);
    console.log(body);
    request.send(body);
  }
}

module.exports = datastore;
