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

exports.sendError = sendError
