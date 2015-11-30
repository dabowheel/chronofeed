var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;

before("connect", function (done) {
	MongoClient.connect(process.env.MONGODB_TEST_URL, function (error,db) {
	  if (error) {
	    return done(error);
	  }

	  global.db = db;
	  done();
	});
});

after("disconnect", function (done) {
	global.db.close().then(function () {
		done();
	}).catch(function (err) {
		console.log(err);
		done(err);
	});
});
