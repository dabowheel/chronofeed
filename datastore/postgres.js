var pg = require("pg");

function Postgres() {
  this.client = null;
  this.done = null;
  this.events = {
    row: function(row) {},
    end: function(resObj) {},
    error: function(error) {},
    sent: function(client,done) {}
  };
}
Postgres.prototype.error = function(error) {
  this.events.error(error);
  this.events.sent(this.client,this.done);
};
Postgres.prototype.end = function () {
  this.events.end();
  this.events.sent(this.client,this.done);
};
Postgres.prototype.send = function(url,query,args) {
  pg.connect(url, function (error,client,done) {
    if (error) {
      this.events.error(error);
      this.events.sent();
    } else {
      this.client = client;
      this.done = done;
      var q = client.query(query,args);
      q.on("error", this.error.bind(this));
      q.on("row", this.events.row);
      q.on("end", this.end.bind(this));
    }

  }.bind(this));
};
Postgres.prototype.on = function(name,callback) {
  if (this.events[name]) {
    this.events[name] = callback;
  } else {
    this.events.error("Invalid event name: " + name);
  }
};
 
module.exports = Postgres;
