
function User(id,username,email,isAdmin) {
  this.id = id;
  this.username = username;
  this.email = email;
  this.isAdmin = isAdmin;
}

function UserList() {
  this.list = [];
}
UserList.prototype.add = function (user) {
  this.list.push(user);
};
UserList.prototype.loadObject = function (obj) {
  for (var i = 0; i < obj.list.length; i++) {
    var values = obj.list[i];
    this.add(new User(values._id ,values.username, values.email, values.isAdmin));
  }
};
UserList.prototype.delete = function (id) {
  for (var i = 0; i < this.list.length; i++) {
    if (id == this.list[i].id) {
      this.list.splice(i,1);
      return;
    }
  }
};
