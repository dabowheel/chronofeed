var modelPost = require("../post");
var moment = require("moment");

describe("Post", function () {
  var date = new Date();
  var obj = {
    _id: "id",
    title: "title",
    text: "text",
    date: date.toISOString(),
    blogID: "blogid"
  };
  var obj2 = {
    _id: "id2",
    title: "title2",
    text: "text2",
    date: date.toISOString(),
    blogID: "blogid2"
  };
  var post = new modelPost.Post(obj._id, obj.title, obj.text, date, obj.blogID);

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
    expect(post.date.toISOString()).toEqual(date.toISOString());
    expect(post.blogID).toEqual(obj2.blogID);
    expect(post.domID).toEqual(obj2.domID);
  });
});
