var model = require("./model");
var dateUtil = require("./dateUtil");

function User(_id,username,email,emailVerified,joinedDate) {
  this._id = _id;
  this.username = username;
  this.email = email;
  this.emailVerified = emailVerified;
  this.joinedDate = joinedDate;
  this.postLoad();
}
User.prototype = new model.Model();
User.prototype.schema = {
  _id: String,
  username: String,
  email: String,
  emailVerified: Boolean,
  joinedDate: Date
};
User.prototype.postLoad = function () {
  if (this.joinedDate) {
    this.joinedDateString = dateUtil.toDateString(this.joinedDate);
    this.joinedDateOnly = dateUtil.getInputDateValue(this.joinedDate);
  }
};

function UserList() {
  this.list = [];
}
UserList.prototype.add = function (user) {
  this.list.push(user);
};
UserList.prototype.loadObject = function (obj) {
  for (var i = 0; i < obj.list.length; i++) {
    var values = obj.list[i];
    var user = new User();
    user.loadObject(values);
    this.add(user);
  }
};
UserList.prototype.exportObject = function () {
  var ret = {
    list: []
  };

  for (var user of this.list) {
    ret.list.push(user.exportObject());
  }
  return ret;
};
UserList.prototype.delete = function (_id) {
  for (var i = 0; i < this.list.length; i++) {
    if (this.list[i]._id == _id) {
      this.list.splice(i,1);
      return;
    }
  }
};
UserList.prototype.getUser = function (_id) {
  for (var i = 0; i < this.list.length; i++) {
    if (this.list[i]._id == _id) {
      return this.list[i];
    }
  }
  return null;
};

exports.User = User;
exports.UserList = UserList;
