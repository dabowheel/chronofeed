var blogList = require("../blogList");

describe("blogList", function() {
  it("should return list of blogs", function(done) {
    req = {
      action: "read",
      userID: 1
    };
    blogList(req, function (res) {
      console.log(res);
      expect(res.userID).toEqual(1);
      for (var i in res.list) {
        expect(res.list[i].blogID).toBeGreaterThan(0);
        expect(typeof res.list[i].title).toEqual("string");
        expect(res.list[i].userID).toEqual(1);
      }
      done();
    });
  });
});
