var modelPost = require("../post");

describe("Post", function () {
  var date = new Date();
  var obj = {
    _id: "id",
    title: "title",
    text: "text",
    date: date.toString(),
    blogID: "blogid",
    domID: "domid"
  };
  var obj2 = {
    _id: "id2",
    title: "title2",
    text: "text2",
    date: date.toString(),
    blogID: "blogid2",
    domID: "domid2"
  };
  var post = new modelPost.Post(obj._id, obj.title, obj.text, date, obj.blogID, obj.domID);

  it("should be created", function () {
    expect(post._id).toEqual(obj._id);
    expect(post.title).toEqual(obj.title);
    expect(post.text).toEqual(obj.text);
    expect(post.date.toString()).toEqual(date.toString());
    expect(post.blogID).toEqual(obj.blogID);
    expect(post.domID).toEqual(obj.domID);
  });

  it("should export object", function () {
    expect(post.exportObject()).toEqual(obj);
  });

  it("should load object", function () {
    post.loadObject(obj2);
    expect(post._id).toEqual(obj2._id);
    expect(post.title).toEqual(obj2.title);
    expect(post.text).toEqual(obj2.text);
    expect(post.date.toString()).toEqual(date.toString());
    expect(post.blogID).toEqual(obj2.blogID);
    expect(post.domID).toEqual(obj2.domID);
  });
});
