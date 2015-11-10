"use strict";
var model = require("./model");
let moment = require("moment");

function User(_id,username,email,emailVerified,joinedDate) {
  this._id = _id;
  this.username = username;
  this.email = email;
  this.emailVerified = emailVerified;
  this.joinedDate = joinedDate;
  this.schema = {
    _id: String,
    username: String,
    email: String,
    emailVerified: Boolean,
    joinedDate: Date
  };
}
User.prototype = new model.Model();
User.prototype.constructor = User;
User.prototype.afterLoad = function () {
  if (this.joinedDate) {
    this.joinedDateOnly = moment(this.joinedDate).format("M/D/YYYY");
  }
};

function UserList() {
  this.list = [];
  this.schema = {
    list: User
  };
}
UserList.prototype = new model.Model();
UserList.prototype.constructor = UserList;
UserList.prototype.add = function (user) {
  this.list.push(user);
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
