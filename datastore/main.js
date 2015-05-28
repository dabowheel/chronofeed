var pg = require("pg");
var user = require("./user")
var blogList = require("./blogList")

function getObject(req,callback) {
  var body = "";
  req.on("data", function(data) {
    body += data;
  });
  req.on("end", function() {
    try { 
      callback(null,JSON.parse(body));
    } catch (error) {
      callback(error,null);
    }
  });
}

function routeRequest(inObject,callback) {
  if (inObject.type == "user") {
    user(inObject, callback);
  } else if (inObject.type == "blogList") {
    blogList(inObject, callback);
  } else {
    callback({
      success: false,
      error: "Invalid request type: " + inObject.type
    });
  }
}

function processRequest(req,res) {
  getObject(req, function (error,inObject) {
    if (error) {
      res.send(JSON.stringify({
        success: false,
        error: error
      }));
    } else {
      routeRequest(inObject, function (outObject) {
        res.send(JSON.stringify(outObject));
      });
    }
  });
}

module.exports = processRequest;
