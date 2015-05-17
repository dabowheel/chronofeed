function datastore(type,action,obj,callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState==4 && request.status==200) {
      console.log(request.responseText);
      try {
        var resObj = JSON.parse(request.responseText);
      } catch(e) {
        var resObj = {
          success: false,
          data: "JSON parse error: " + e
        }
      }
      console.log(resObj);
      callback(resObj);
    }
  };

  var sendObj = {
    type: type,
    action: action,
    data: obj
  };

  request.open("POST","datastore/main.php",true);
  request.setRequestHeader("Content-type","application/json");
  request.send(JSON.stringify(sendObj));
}
