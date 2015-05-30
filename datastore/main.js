var pg = require("pg");
var util = require("./util");
var user = require("./user")
var blogList = require("./blogList")
var blog = require("./blog");

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
  } else if (inObject.type == "blog") {
    blog(inObject, callback);
  } else if (inObject.type == "blogList") {
    blogList(inObject, callback);
  } else {
    util.sendError("Invalid request type: " + inObject.type,callback);
  }
}

function processRequest(req,res) {
  getObject(req, function (error,inObject) {
    if (error) {
      util.sendError(error,res);
      return;
    }
    console.log(inObject);
    routeRequest(inObject, function (outObject) {
      res.send(JSON.stringify(outObject));
    });
  });
}

module.exports = processRequest;
