var util = require("./util");

function blog(connection,inObject,callback) {
  if (inObject.action == "read") {
    blogRead(connection,inObject.blogID,callback);
  } else {
    util.sendError("Invalid blog action: " + inObject.action,callback);
  }
}

function blogRead(connection,blogID,callback) {
  var str = "select title,user_id FROM blogs WHERE blog_id = $1";
  var args = [blogID];
  q = connection.query(str,args);

  q.on("error", function (error) {
    connection.done();
    util.sendError(error,callback);
  });

  var title = "";
  var userID = "";
  q.on("row", function (row) {
    title = row.title;
    userID = row.user_id
  })

  q.on("end", function () {
    var str = "select post_id,title,post,date,user_id from posts WHERE blog_id = $1 ORDER BY date DESC";
    var args = [blogID];
    q = connection.query(str,args);

    q.on("error", function (error) {
      connection.done();
      util.sendError(error,callback);
    });

    var ret = {
      success: true,
      blog: {
        blogID: blogID,
        title: title,
        userID: userID,
        postList: []
      }
    }

    q.on("row", function (row) {
      ret.blog.postList[ret.blog.postList.length] = {
        postID: row.post_id,
        title: row.title,
        text: row.post,
        date: row.date,
        blogID: blogID,
        userID: row.user_id
      };
    });

    q.on("end", function () {
      connection.done();
      callback(ret);
    });
  });
}

module.exports = blog;
