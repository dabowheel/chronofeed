"use strict";
let log = require("./log");

module.exports = function (app,db) {
  app.use("/api/", function (req,res,next) {
    req.db = db;
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    next();
  });

	app.put("/api/log/", log.createLog);
  app.get("/api/log/", log.readLogList);
  app.get("/api/log/:id/", log.readLog);
	app.post("/api/log/:id/", log.updateLog);
	app.delete("/api/log/", log.deleteLogList);
	app.delete("/api/log/:id/", log.deleteLog);

  app.param(["id"], function (req,res,next,value) {
    req.api = {
      id: value
    };
    next();
  });
};
