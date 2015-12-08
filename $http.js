"use strict";

exports.request = function(options,body,isHTTPS) {
  let app = isHTTPS ? require("https") : require("http");
  return new Promise(function (resolve,reject) {
    let resBody = "";
    let req = app.request(options, function (res) {
      res.getData = function () {
        return new Promise(function (resolve, reject) {
          res.on("data", function (data) {
            resBody += data.toString();
          });
          res.on("end", function () {
            resolve(resBody);
          });
        });
      };
      resolve(res);
    });
    req.on("error", function (err) {
      reject(err);
    });
    req.end(body);
  });
};