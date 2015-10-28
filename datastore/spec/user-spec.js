xdescribe("user", function () {
  it("should login", function (done) {
    var inObject = {
      type: "user",
      action: "login",
      user: {
        username: process.env.STRUCTURED_NOTES_USER,
        password: process.env.STRUCTURED_NOTES_PASSWORD
      }
    };
    var session = {};
    main.dbRequest(session, inObject, false, function(outObject) {
      expect(outObject.login).toEqual(true);
      done();
    });
  });
});
