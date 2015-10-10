
function User(id,username,email,isAdmin) {
  this.id = id;
  this.username = name;
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
    this.list.add(new User(values.id ,values.username, values.email, values.isAdmin));
  }
};
