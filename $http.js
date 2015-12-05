"use strict";
let http = require("http");
let https = require("https");

module.exports = function(options,body,isHTTPS) {
  let app = isHTTPS ? https : http;
  return new Promise(function (resolve,reject) {
    app.request(options, function () {
      
    });
  });
};