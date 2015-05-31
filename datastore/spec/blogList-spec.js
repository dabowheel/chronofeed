var main = require("../main");
var blogList = require("../blogList");

describe("blogList", function() {
  it("should return list of blogs", function(done) {
    req = {
      type: "blogList",
      action: "read",
      userID: 1
    };
    main.routeRequest(req, false, function (res) {
      expect(res.blogList.userID).toEqual(1);
      for (var i in res.blogList.list) {
        expect(res.blogList.list[i].blogID).toBeGreaterThan(0);
        expect(typeof res.blogList.list[i].title).toEqual("string");
        expect(res.blogList.list[i].userID).toEqual(1);
      }
      done();
    });
  });
});
