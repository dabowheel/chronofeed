var util = require("./util");
var user = require("./user");
var blogList = require("./blogList");
var blog = require("./blog");
var blogInfo = require("./blogInfo");

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

function routeRequest(inObject,pool,callback) {
  util.pgConnect(process.env.DATABASE_URL, pool, function (error, connection) {
    if (error) {
      util.sendError(error, callback);
      return;
    }

    if (inObject.type == "user") {
      user(connection, inObject, callback);
    } else if (inObject.type == "blogList") {
      blogList(connection, inObject, callback);
    } else if (inObject.type == "blog") {
      blog(connection, inObject, callback);
    } else if (inObject.type == "blogInfo") {
      blogInfo(connection, inObject, callback);
    } else {
      util.sendError("Invalid request type: " + inObject.type,callback);
    }
  });
}

function processRequest(req,res) {
  getObject(req, function (error,inObject) {
    if (error) {
      util.sendError(error,res);
      return;
    }
    console.log(inObject);
    routeRequest(inObject, true, function (outObject) {
      res.send(JSON.stringify(outObject));
    });
  });
}

exports.processRequest = processRequest;
exports.routeRequest = routeRequest;
