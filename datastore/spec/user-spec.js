var main = require("../main");
var user = require("../user");

describe("user", function () {
  it("should login", function (done) {
    req = {
      type: "user",
      action: "login",
      user: {
        username: process.env.STRUCTURED_NOTES_USER,
        password: process.env.STRUCTURED_NOTES_PASSWORD
      }
    }
    main.routeRequest(req, false, function(res) {
      expect(res.login).toEqual(true);
      done();
    });
  });
});
