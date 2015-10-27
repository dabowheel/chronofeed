function datastore(method,path,obj,callback) {
  console.log("send",method,path,obj);
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState==4) {
      if (request.status==200) {
        var res;
        if (request.responseText === "") {
          callback(null,null);
        } else {
          try {
            res = JSON.parse(request.responseText);
          } catch(e) {
            console.log("response err",e);
            callback("JSON parse error: " + e);
            return;
          }
          console.log("response",JSON.stringify(res));
          callback(null,res);
        }
      } else {
        console.log("response err",request.responseText);
        var err = request.responseText;
        if (!err) {
          err = request.statusText;
        }
        if (!err) {
          err = "connection error";
        }
        callback(err);
      }
    }
  };

  request.open(method,"/datastore/" + path,true);
  if (method == "GET") {
    request.send();
  } else {
    request.setRequestHeader("Content-type","application/json");
    var body = JSON.stringify(obj);
    request.send(body);
  }
}

module.exports = datastore;
