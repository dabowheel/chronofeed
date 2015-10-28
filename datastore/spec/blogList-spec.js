xdescribe("blogList", function() {
  it("should return list of blogs", function(done) {
    var inObject = {
      type: "blogList",
      action: "read",
      userID: 1
    };
    var session = {
      userID: 1
    };
    main.dbRequest(session, inObject, false, function (outObject) {
      expect(outObject.blogList.userID).toEqual(1);
      for (var i in outObject.blogList.list) {
        expect(outObject.blogList.list[i].blogID).toBeGreaterThan(0);
        expect(typeof outObject.blogList.list[i].title).toEqual("string");
        expect(outObject.blogList.list[i].userID).toEqual(1);
      }
      done();
    });
  });
});
