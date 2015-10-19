var modelBlogList = require("../blogList");
var modelBlog = require("../blog");

describe("blog list", function () {
  var obj = {
    list: [
      {
        _id: "id1",
        title: "title B",
        domID: "domid1"
      },
      {
        _id: "id2",
        title: "title A",
        domID: "domid2"
      }
    ]
  };

  it("should be created", function () {
    var blogList = new modelBlogList.BlogList();
    blogList.add(new modelBlog.Blog("id1", "title", "domid1"));
    blogList.add(new modelBlog.Blog("id2", "title", "domid2"));
    expect(blogList.list[0]._id).toEqual("id1");
    expect(blogList.list[1]._id).toEqual("id2");
  });

  it("should load an object", function () {
    var blogList = new modelBlogList.BlogList();
    blogList.loadObject(obj);
    expect(blogList.list[0]._id).toEqual("id1");
    expect(blogList.list[1]._id).toEqual("id2");
  });

  it("should sort blogs", function () {
    var blogList = new modelBlogList.BlogList();
    blogList.loadObject(obj);
    blogList.sort();
    expect(blogList.list[0]._id).toEqual("id2");
    expect(blogList.list[1]._id).toEqual("id1");
  });
})
