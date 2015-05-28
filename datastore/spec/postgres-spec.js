var pg = require("pg");
var Postgres = require("../postgres")

xdescribe("Postgres", function () {
  it("should query", function(done) {
    db = new Postgres();
    db.on("error", function (error) {
      console.error(error);
    });
    db.on("row", function (row) {
      console.log(row);
    });
    db.on("sent", function(client) {
      if (client) {
        client.end();
      }
      done();
    });
    db.on("end", function () {
    });
    db.send(process.env.DATABASE_URL,"select * from blogs");
  });
});