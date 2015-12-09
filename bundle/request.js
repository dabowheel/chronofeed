"use strict";

function request(method,path,obj) {
  console.log("send",method,path,obj);
  return new Promise(function (resolve,reject) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState==4) {
        if (request.status != 200) {
          console.log("response",request.responseText);
          var err = request.responseText;
          if (!err) {
            err = request.statusText;
          }
          if (!err) {
            err = "connection error";
          }
          return reject(new Error(err));
        }

        if (request.responseText === "") {
          return resolve(null);
        }
        let res = JSON.parse(request.responseText);
        console.log("response",JSON.stringify(res));
        resolve(res);
      }
    };

    request.open(method, path, true);
    if (obj) {
      request.setRequestHeader("Content-type","application/json");
      var body = JSON.stringify(obj);
      request.send(body);
    } else {
      request.send();
    }
  });
}

module.exports = request;
