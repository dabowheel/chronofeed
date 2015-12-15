
module.exports = function (app) {
  app.use(function(req,res,next) {
    res.status(404).send("Not Found.");
  });

  app.use(function(err,req,res,next) {
    res.status(500).send("Application Error. " + err);
  });
}