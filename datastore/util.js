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
