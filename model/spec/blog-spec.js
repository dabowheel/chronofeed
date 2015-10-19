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
  var blog;

  beforeEach(function () {
    blog = new modelBlog.Blog();
    blog.loadObject(obj);
  });

  it("should be created", function () {
    var blog = new modelBlog.Blog(obj._id, obj.title);
    var post = obj.postList[0];
    blog.addPost(new modelPost.Post(post._id, post.title, post.text, new Date(post.date), post.blogID, post.domID));

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

  it("should change title", function () {
    var blog = new modelBlog.Blog();
    blog.loadObject(obj);
    blog.editTitle("newtitle");
    expect(blog.title).toEqual("newtitle");
  });

  it("should set edit post", function () {
    var blog = new modelBlog.Blog();
    blog.loadObject(obj);
    blog.editPost("domid");
    expect(blog.postList[0].edit).toEqual(true);
  });

  it("should unset edit post", function () {
    var blog = new modelBlog.Blog();
    blog.loadObject(obj);
    blog.editPost("domid");
    blog.stopEditingPost("domid");
    expect(blog.postList[0].edit).toEqual(false);
  });

  it("should save post", function () {
    var post = new modelPost.Post("newid", "newtitle", "newtext", new Date(), "newblogid", "domid");
    blog.savePost("domid", post);
    expect(blog.postList[0]).toEqual(post);
  });

  it("should delete post", function () {
    blog.deletePost("domid");
    expect(blog.postList.length).toEqual(0);
  });

  it("should get post", function () {
    var post = blog.getPost("domid");
    expect(post).toEqual(blog.postList[0]);
  });

  it("should sort posts", function () {
    var blog = new modelBlog.Blog();
    blog.addPost(new modelPost.Post("1", "title", "text", new Date("1/1/2000"), "blogid", "domid"));
    blog.addPost(new modelPost.Post("2", "title", "text", new Date("1/1/1980"), "blogid", "domid"));
    blog.addPost(new modelPost.Post("3", "title", "text", new Date("1/1/1995"), "blogid", "domid"));
    blog.addPost(new modelPost.Post("4", "title", "text", new Date("1/1/1990"), "blogid", "domid"));
    blog.sort();
    expect(blog.postList[0]._id).toEqual("2");
    expect(blog.postList[1]._id).toEqual("4");
    expect(blog.postList[2]._id).toEqual("3");
    expect(blog.postList[3]._id).toEqual("1");
  });

  it("should sort posts in reverse", function () {
    var blog = new modelBlog.Blog();
    blog.addPost(new modelPost.Post("1", "title", "text", new Date("1/1/2000"), "blogid", "domid"));
    blog.addPost(new modelPost.Post("2", "title", "text", new Date("1/1/1980"), "blogid", "domid"));
    blog.addPost(new modelPost.Post("3", "title", "text", new Date("1/1/1995"), "blogid", "domid"));
    blog.addPost(new modelPost.Post("4", "title", "text", new Date("1/1/1990"), "blogid", "domid"));
    blog.sort(true);
    expect(blog.postList[0]._id).toEqual("1");
    expect(blog.postList[1]._id).toEqual("3");
    expect(blog.postList[2]._id).toEqual("4");
    expect(blog.postList[3]._id).toEqual("2");
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
