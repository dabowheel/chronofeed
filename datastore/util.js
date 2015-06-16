function sendError(error,res) {
  var ret = {
    success: false
  };

  if (error) {
    ret.error = error;
    if (error.stack) {
      ret.stack = error.stack;
    }
  }

  if (typeof res == "function") {
    res(ret);
  } else if (res.send) {
    res.send(JSON.stringify(ret));
  } else {
    throw new Error("Invalid argument to sendError: " + res);
  }
}

var pg = require("pg");

pgConnect = function(url,pool,callback) {
  pg.connect(url,function (error,client,done) {
    var db = null;
    if (!error) {
      db = {
        client: client,
        query: client.query.bind(client),
      };
      if (pool) {
        db.done = done;
      } else {
        db.done = client.end.bind(client);
      }
    }
    callback(error, db);
  });
};

function getJSONFromBody(req,callback) {
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

exports.getJSONFromBody = getJSONFromBody;
exports.sendError = sendError;
exports.pgConnect = pgConnect;
