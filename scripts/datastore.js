function datastore(req,callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState==4 && request.status==200) {
      console.log(request.responseText);
      try {
        var res = JSON.parse(request.responseText);
      } catch(e) {
        var res = {
          success: false,
          error: "JSON parse error: " + e
        }
      }
      console.log(res);
      callback(res);
    }
  };

  request.open("POST","datastore/main.php",true);
  request.setRequestHeader("Content-type","application/json");
  reqText = JSON.stringify(req)
  console.log(reqText);
  request.send(reqText);
}
