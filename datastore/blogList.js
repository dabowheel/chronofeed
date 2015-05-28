var pg = require("pg");

function blogList(inObject,callback) {
  console.log(inObject);
  if (inObject.action == "read") {
    blogListRead(inObject,callback);
  } else {
    callback({
      success: false,
      error: "Invalid blogList action: " + inObject.action
    });
  }
}

function blogListRead(inObject,callback) {
  var userID = 1;
  pg.connect(process.env.DATABASE_URL, function (error,client,done) {
    if (error) {
      callback({
        success: false,
        error: error,
        stack: error.stack
      });
      return;
    }
    var str = "select blog_id,title,user_id FROM blogs WHERE user_id = $1 ORDER BY title ASC";
    q = client.query(str,[userID]);

    q.on("error", function(error) {
      done();
      callback({
        success: false,
        error: error
      })
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
