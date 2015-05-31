var util = require("./util");

function blogList(connection,inObject,callback) {
  if (inObject.action == "read") {
    blogListRead(connection, inObject.userID, callback);
  } else {
    util.sendError("Invalid blogList action: " + inObject.action, callback);
  }
}

function blogListRead(connection,userID,callback) {
  var str = "select blog_id,title,user_id FROM blogs WHERE user_id = $1 ORDER BY title ASC";
  var args = [userID];
  q = connection.query(str,args);

  q.on("error", function(error) {
    connection.done();
    util.sendError(eror,callback);
  });

  var ret = {
    success: true,
    blogList: {
      userID: userID,
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
    connection.done();
    callback(ret);
  });
}

module.exports = blogList;
