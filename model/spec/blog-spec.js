var modelBlog = require("../blog");
var modelPost = require("../post");

describe("Blog", function () {
  var date = new Date();
  var obj = {
    _id: "id",
    title: "title",
    postList: [
      {
        _id: "id1",
        title: "title1",
        text: "text1",
        date: date.toString(),
        blogID: "blogid",
        domID: "domid"
      }
    ]
  };

  it("should be created", function () {
    var blog = new modelBlog.Blog(obj._id, obj.title);
    var post = obj.postList[0];
    blog.addPost(new modelPost.Post(post._id, post.title, post.text, new Date(post.date), post.blogID, post.domID))

    expect(blog._id).toEqual(obj._id);
    expect(blog.title).toEqual(obj.title);
    expect(blog.postList[0].exportObject()).toEqual(obj.postList[0]);
  });

  it("should load object", function () {
    var blog = new modelBlog.Blog();
    blog.loadObject(obj);

    expect(blog._id).toEqual(obj._id);
    expect(blog.title).toEqual(obj.title);
    expect(blog.postList[0].exportObject()).toEqual(obj.postList[0]);
  });
});

describe("BlogInfo", function () {
  var obj = {
    _id: "id",
    title: "title"
  };

  it("should be created", function () {
    var blog = new modelBlog.BlogInfo(obj._id, obj.title);
    expect(blog._id).toEqual(obj._id);
    expect(blog.title).toEqual(obj.title);
  });

  it ("should load object", function () {
    var blog = new modelBlog.BlogInfo();
    blog.loadObject(obj);
    expect(blog._id).toEqual(obj._id);
    expect(blog.title).toEqual(obj.title);
  });

  it ("should export object", function () {
    var blog = new modelBlog.BlogInfo(obj._id, obj.title);
    expect(blog.exportObject()).toEqual(obj);
  });
});
