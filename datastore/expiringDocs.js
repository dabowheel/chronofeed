"use strict";
let util = require("./util");

function getExpiredCount(db,colName) {
  return new Promise(function (resolve,reject) {
    let col = db.collection(colName);
    let ret = {};

    // wait for counts to be calculated
    let wait = new util.Wait(2, function (resolveCount, rejectCount) {
      if (rejectCount > 0) {
        reject(ret.error);
      } else {
        resolve(ret);
      }
    });

    // collection count
    let p1 = col.count();
    function resolveCount(count) {
      ret.count = count;
      wait.resolve();
    }
    function rejectCount(err) {
      if (!err) {
        err = "Could not get collection count";
      }
      ret.error = err;
      wait.reject();
    }
    p1.then(resolveCount, rejectCount);

    // expired count
    let d = new Date();
    d.setDate(d.getDate()-14);
    let filter = {
      created: {
        $lt: d
      }
    };
    let p2 = col.find(filter).count();
    function resolveExpiredCount(count) {
      ret.expiredCount = count;
      wait.resolve();
    }
    function rejectExpiredCount(err) {
      if (!err) {
        err = "Could not get expired record count";
      }
      ret.error = err;
      wait.reject();
    }
    p2.then(resolveExpiredCount, rejectExpiredCount);
  });
}

exports.getExpiredTable = function (req,res,next) {
  let colList = ["reset", "verify"];
  let ret = {};

  let wait = new util.Wait(colList.length, function (resolveCount, rejectCount) {
    if (rejectCount > 0) {
      next(ret.error);
    } else {
      res.json(ret);
    }
  });

  for (let name of ["reset", "verify"]) {
    let p = getExpiredCount(req.db, name);
    let onResolve = function (row) {
      ret[name] = row;
      wait.resolve();
    };
    let onReject = function (err) {
      ret.error = err;
      wait.reject();
    };
    p.then(onResolve, onReject);
  }
};

exports.cleanupExpired = function (db,colName) {
  return new Promise(function (resolve,reject) {
    let d = new Date();
    d.setDate(d.getDate() - 14);
    let filter = {
      created: {
        $lt: d
      }
    };
    let col = db.collection(colName);
    col.deleteMany(filter, function (err, deleteResult) {
      if (err) {
      return reject(err);
      }

      resolve(deleteResult.deletedCount);
    });
  });
};
