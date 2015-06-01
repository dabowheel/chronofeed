function datastore(req,callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState==4 && request.status==200) {
      console.log(request.responseText);
      var res;
      try {
        res = JSON.parse(request.responseText);
      } catch(e) {
        res = {
          success: false,
          error: "JSON parse error: " + e
        };
      }
      console.log(res);
      callback(res);
    }
  };

  request.open("POST","datastore/main/",true);
  request.setRequestHeader("Content-type","application/json");
  reqText = JSON.stringify(req);
  console.log(reqText);
  request.send(reqText);
}
