var util = require("./util");

function sessionRequest(session,inObject,callback) {
  switch (inObject.type) {

    case "user":
      if (inObject.action == "logout") {
        return function (db) {
          userLogout(db,session,inObject,callback);
        }
      }
      break;

    case "blogList":
      if (inObject.action == "read") {
        return function (db) {
          blogListRead(db, session, inObject, callback);
        };
      }
      break;

    case "blog":
      if (inObject.action == "read") {
        return function (db) {
          blogRead(db,session,inObject,callback);
        }
      }
      break;

    case "blogInfo":
      if (inObject.action == "update") {
        return function (db) {
          blogInfoUpdate(db,session,inObject,callback);
        }
      } else if (inObject.action == "create") {
        return function (db) {
          blogInfoCreate(db,session,inObject,callback);
        }
      } else if (inObject.action == "delete") {
        return function (db) {
          blogInfoDelete(db,session,inObject,callback);
        }
      }
      break;

    case "post":
      if (inObject.action == "create") {
        return function (db) {
          postCreate(db,session,inObject,callback);
        }
      } else if (inObject.action == "update") {
        return function (db) {
          postUpdate(db,session,inObject,callback);
        }
      } else if (inObject.action == "delete") {
        return function (db) {
          postDelete(db,session,inObject,callback);
        }
      }
      break;

  }
}

function userLogout(db,session,inObject,callback) {
  delete session.userID;
  callback({
    success: true,
    logout: true
  })
}

function blogListRead(db,session,inObject,callback) {
  var str = "select blog_id,title,user_id FROM blogs WHERE user_id = $1 ORDER BY title ASC";
  var args = [session.userID];
  q = db.query(str,args);

  q.on("error", function(error) {
    db.done();
    util.sendError(eror,callback);
  });

  var ret = {
    success: true,
    blogList: {
      userID: session.userID,
      list: []
    }
  };

  q.on("row", function(row) {
    ret.blogList.list[ret.blogList.list.length] = {
      blogID: row.blog_id,
      title: row.title,
      userID: row.user_id
    };
  });

  q.on("end", function() {
    db.done();
    callback(ret);
  });
}

function blogRead(db,session,inObject,callback) {
  var str = "select title,user_id FROM blogs WHERE blog_id = $1 AND user_id = $2";
  var args = [inObject.blogID,session.userID];
  q = db.query(str,args);

  q.on("error", function (error) {
    db.done();
    util.sendError(error,callback);
  });

  var title = ""
  var userID = "";
  q.on("row", function (row) {
    title = row.title;
  })

  q.on("end", function () {
    var str = "select post_id,title,post,date,user_id from posts WHERE user_id = $1 AND blog_id = $2 ORDER BY date DESC";
    var args = [session.userID,inObject.blogID];
    q = db.query(str,args);

    q.on("error", function (error) {
      db.done();
      util.sendError(error,callback);
    });

    var ret = {
      success: true,
      blog: {
        blogID: inObject.blogID,
        title: title,
        userID: session.userID,
        postList: []
      }
    }

    q.on("row", function (row) {
      ret.blog.postList[ret.blog.postList.length] = {
        postID: row.post_id,
        title: row.title,
        text: row.post,
        date: row.date,
        blogID: inObject.blogID,
        userID: row.user_id
      };
    });

    q.on("end", function () {
      db.done();
      callback(ret);
    });
  });
}

function blogInfoUpdate(db, session, inObject, callback) {
  var str = "UPDATE blogs SET title = $1 WHERE user_id = $2 AND blog_id = $3"
  var args = [inObject.blogInfo.title,session.userID,inObject.blogInfo.blogID];
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

function blogInfoCreate(db,session,inObject,callback) {
  var str = "INSERT INTO blogs(title,user_id) VALUES($1,$2) RETURNING blog_id";
  var args = [inObject.blogInfo.title,session.userID];
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

function blogInfoDelete(db,session,inObject,callback) {
  var str = "DELETE FROM posts WHERE user_id = $1 AND blog_id = $2";
  var args = [session.userID,inObject.blogID];
  var q = db.query(str,args);

  q.on("error", function (error) {
    db.done();
    util.sendError(error, callback);
    return;
  });

  q.on("end", function () {
    var str = "DELETE FROM blogs WHERE user_id = $1 AND blog_id = $2";
    var args = [session.userID,inObject.blogID];
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

function postUpdate(db,session,inObject,callback) {
  var str = "UPDATE posts SET title = $1, post = $2, date = $3 WHERE user_id = $4 AND post_id = $5 AND blog_id = $6";
  var args = [inObject.post.title,inObject.post.text,inObject.post.dbDateString,session.userID,inObject.post.postID,inObject.post.blogID];
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

function postCreate(db,session,inObject,callback) {
  var str = "INSERT INTO posts(title,post,date,blog_id,user_id) VALUES($1,$2,$3,$4,$5) RETURNING post_id";
  var args = [inObject.post.title,inObject.post.text,inObject.post.dbDateString,inObject.post.blogID,session.userID];
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

function postDelete(db,session,inObject,callback) {
  var str = "DELETE FROM posts WHERE user_id = $1 AND post_id = $2";
  var args = [session.userID,inObject.postID];
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

module.exports = sessionRequest;
