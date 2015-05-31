function sendError(error,res) {
  var ret = {
    success: false
  }

  if (error) {
    ret.error = error
    if (error.stack) {
      ret.stack = error.stack
    }
  }

  if (typeof res == "function") {
    res(ret);
  } else if (res.send) {
    res.send(JSON.stringify(ret));
  } else {
    throw new Error("Invalid argument to sendError: " + res)
  }
}

var pg = require("pg");

pgConnect = function(url,pool,callback) {
  pg.connect(url,function (error,client,done) {
    var connection = null;
    if (!error) {
      connection = {
        client: client,
        query: client.query.bind(client),
      }
      if (pool) {
        connection.done = done;
      } else {
        connection.done = client.end.bind(client);
      }
    }
    callback(error, connection);
  })
};

exports.sendError = sendError
exports.pgConnect = pgConnect
