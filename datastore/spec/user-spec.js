var user = require("../user");

describe("user", function () {
  it("should login", function (done) {
    req = {
      action: "login",
      user: {
        username: process.env.STRUCTURED_NOTES_USER,
        password: process.env.STRUCTURED_NOTES_PASSWORD
      }
    }
    user(req, function(res) {
      console.log(res);
      done();
    });
  });
});
