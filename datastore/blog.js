var pg = require("pg");
var util = require("./util");

function blog(inObject,callback) {
  if (inObject.action == "read") {
    blogRead(inObject.blogID,callback);
  } else {
    util.sendError("Invalid blog action: " + inObject.action,callback);
  }
}

function blogRead(blogID,callback) {
  pg.connect(process.env.DATABASE_URL, function (error,client,done) {
    if (error) {
      util.sendError(error,callback);
      return;
    }

    var str = "select title,user_id FROM blogs WHERE blog_id = $1";
    var args = [blogID];
    q = client.query(str,args);

    q.on("error", function (error) {
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
      q = client.query(str,args);

      q.on("error", function (error) {
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
        callback(ret);
      });
    });
  });
}

module.exports = blog;
