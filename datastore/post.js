var util = require("./util");

function post(db,inObject,callback) {
  switch (inObject.action) {
    case "update":
      postUpdate(db,inObject.post,callback);
      break;
    case "create":
      postCreate(db,inObject.post,callback);
      break;
    case "delete":
      postDelete(db,inObject.postID,callback);
      break;
    default:
      util.sendError("Invalid post action: " + inObject.action,callback);
  }
}

function postUpdate(db,post,callback) {
  var str = "UPDATE posts SET title = $1, post = $2, date = $3 WHERE post_id = $4 AND blog_id = $5";
  var args = [post.title,post.text,post.dbDateString,post.postID,post.blogID];
  var q = db.query(str,args);

  q.on("error", function (error) {
    db.done();
    util.sendError(error,callback);
  });

  q.on("end", function () {
    db.done();
    callback({
      success: true,
    });
  });
}

function postCreate(db,post,callback) {
  var str = "INSERT INTO posts(title,post,date,blog_id,user_id) VALUES($1,$2,$3,$4,$5) RETURNING post_id";
  var args = [post.title,post.text,post.dbDateString,post.blogID,post.userID];
  var q = db.query(str,args);

  q.on("error", function (error) {
    db.done();
    util.sendError(error,callback)
  });

  var postID;

  q.on("row", function (row) {
    postID = row.post_id;
  });

  q.on("end", function () {
    db.done();
    callback({
      success: true,
      postID: postID
    });
  });
}

function postDelete(db,postID,callback) {
  var str = "DELETE FROM posts WHERE post_id = $1";
  var args = [postID];
  var q = db.query(str,args);

  q.on("error", function (error) {
    db.done();
    util.sendError(error,callback);
  });

  q.on("end", function () {
    db.done();
    callback({
      success: true
    });
  });
}

module.exports = post;
