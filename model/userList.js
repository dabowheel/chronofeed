
function User(_id,username,email) {
  this._id = _id;
  this.username = username;
  this.email = email;
}
User.prototype.exportObject = function () {
  return {
    _id: this._id,
    username: this.username,
    email: this.email
  };
}
User.prototype.loadObject = function (obj) {
  this._id = obj._id;
  this.username = obj.username;
  this.email = obj.email;
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
    this.add(new User(values._id ,values.username, values.email));
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
}
UserList.prototype.delete = function (_id) {
  for (var i = 0; i < this.list.length; i++) {
    if (this.list[i]._id == _id) {
      this.list.splice(i,1);
      return;
    }
  }
};

exports.User = User;
exports.UserList = UserList;
