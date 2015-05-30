var pg = require("pg");
var util = require("./util");

function blogList(inObject,callback) {
  if (inObject.action == "read") {
    blogListRead(inObject.userID,callback);
  } else {
    util.sendError("Invalid blogList action: " + inObject.action, callback);
  }
}

function blogListRead(userID,callback) {
  pg.connect(process.env.DATABASE_URL, function (error,client,done) {
    if (error) {
      util.sendError(error,callback);
      return;
    }
    var str = "select blog_id,title,user_id FROM blogs WHERE user_id = $1 ORDER BY title ASC";
    var args = [userID];
    console.log(str);
    console.log(args);
    q = client.query(str,args);

    q.on("error", function(error) {
      done();
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
      done();
      callback(ret);
    });
  });
}

module.exports = blogList;
