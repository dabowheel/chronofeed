var util = require("./util");

function blogInfo(db,inObject,callback) {
  if (inObject.action == "update") {
    blogInfoUpdate(db,inObject.blogInfo,callback)
  } else if (inObject.action == "create") {
    blogInfoCreate(db,inObject.blogInfo,callback);
  } else if (inObject.action == "delete") {
    blogInfoDelete(db,inObject.blogID,callback);
  } else {
    db.done();
    util.sendError("Invalid blogInfo action: " + inObject.action, callback);
  }
}

function blogInfoUpdate(db, blogInfo, callback) {
  var str = "UPDATE blogs SET title = $1 WHERE blog_id = $2"
  var args = [blogInfo.title,blogInfo.blogID];
  var q = db.query(str,args);

  q.on("error", function (error) {
    db.done();
    util.sendError(error, callback);
    return;
  });

  q.on("end", function () {
    db.done();
  });
}

function blogInfoCreate(db,blogInfo,callback) {
  var str = "INSERT INTO blogs(title,user_id) VALUES($1,$2) RETURNING blog_id";
  var args = [blogInfo.title,blogInfo.userID];
  var q = db.query(str,args);

  q.on("error", function (error) {
    db.done();
    util.sendError(error, callback);
    return;
  });

  var blogID;
  q.on("row", function (row) {
    blogID = row.blog_id;
  });

  q.on("end", function () {
    db.done();
    callback({
      success: true,
      blogID: blogID
    });
  });
}

function blogInfoDelete(db,blogID,callback) {
  var str = "DELETE FROM posts WHERE blog_id=$1";
  var args = [blogID];
  var q = db.query(str,args);

  q.on("error", function (error) {
    db.done();
    util.sendError(error, callback);
    return;
  });

  q.on("end", function () {
    var str = "DELETE FROM blogs WHERE blog_id=$1";
    var args = [blogID];
    var q = db.query(str,args);

    q.on("error", function (error) {
      db.done();
      util.sendError(error, callback);
      return;
    })

    q.on("end", function() {
      db.done();
      callback({
        success: true
      });
    });
  });
}


module.exports = blogInfo;
