"use strict";
let log = require("./log");
let session = require("./session");
let user = require("./user");
let entry = require("./entry");

module.exports = function (app,db) {
  // caching
  app.use("/api/", function (req,res,next) {
    req.db = db;
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    next();
  });

  // log
  app.use("/api/log/*", function (req,res,next) {
    if (!req.session.userID) {
      return res.redirect("/login.html");
    }
    next();
  });

	app.put("/api/log/", log.createLog);
  app.get("/api/log/", log.readLogList);
  app.get("/api/log/:id/", log.readLog);
	app.post("/api/log/:id/", log.updateLog);
	app.delete("/api/log/", log.deleteLogList);
	app.delete("/api/log/:id/", log.deleteLog);

  // session
  app.post("/api/signup/", session.signup);
  app.post("/api/login/", session.login);
  app.get("/api/logout/", session.logout);

  // user
  app.delete("/api/user/:id/", user.deleteUser);

  // entry
  app.put("/api/entry/:logID/", entry.createEntry);
  app.get("/api/entry/:logID/:id/", entry.readEntry);
  app.get("/api/entry/:logID/", entry.readEntryList);
  app.post("/api/entry/:logID/:id/", entry.updateEntry);
  app.delete("/api/entry/:logID/:id", entry.deleteEntry);
  app.delete("/api/entry/:logID/", entry.deleteEntryList);

  // params
  app.param(["id"], function (req,res,next,value) {
    if (!req.api) req.api = {};
    req.api.id = value;
    next();
  });

  app.param(["logID"], function (req,res,next,value) {
    if (!req.api) req.api = {};
    req.api.logID = value;
    next();
  });
};
