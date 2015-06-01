var util = require("./util");
var request = require("./request");
var sessionRequest = require("./sessionRequest");

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

function dbRequest(session,inObject,pool,callback) {
  var sessionFunc = sessionRequest(session,inObject,callback);
  var nonSessionFunc = request(session,inObject,callback);

  var func;
  if (nonSessionFunc) {
    func = nonSessionFunc;
  } else if (sessionFunc && session.userID) {
    func = sessionFunc;
  } else if (sessionFunc) {
    callback({
      success: false,
      endSession: true
    });
  } else {
    sendError("Invalid request: " + inObject.type + " " + inObject.action);
  }

  if (func) {
    util.pgConnect(process.env.DATABASE_URL, pool, function (error, db) {
      if (error) {
        util.sendError(error, callback);
        return;
      }

      func(db);
    });
  }
}

function processRequest(req,res) {
  getObject(req, function (error,inObject) {
    if (error) {
      util.sendError(error,res);
      return;
    }
    console.log(inObject);
    dbRequest(req.session,inObject, true, function (outObject) {
      res.send(JSON.stringify(outObject));
    });
  });
}

exports.processRequest = processRequest;
exports.dbRequest = dbRequest;
