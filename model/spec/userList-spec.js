var modelUserList = require("../userList");

describe("user", function () {
  var obj = {
    _id: "id",
    username: "username",
    email: "email"
  };
  var user;

  beforeEach(function () {
    user = new modelUserList.User(obj._id, obj.username, obj.email);
  });

  it("should create a user", function () {
    expect(user._id).toEqual(obj._id);
    expect(user.username).toEqual(obj.username);
    expect(user.email).toEqual(obj.email);
  });

  it("should export an object", function () {
    expect(user.exportObject()).toEqual(obj);
  });

  it("should load an object", function () {
    var user2 = new modelUserList.User();
    user2.loadObject(obj);
    expect(user2.exportObject()).toEqual(obj);
  });
});

describe("user list", function () {
  var obj = {
    list: [
      {
        _id: "id",
        username: "username",
        email: "email"
      },
      {
        _id: "id2",
        username: "username2",
        email: "email2"
      }
    ]
  };

  var userList;

  beforeEach(function () {
    userList = new modelUserList.UserList();
    userList.add(new modelUserList.User("id", "username", "email"));
    userList.add(new modelUserList.User("id2", "username2", "email2"));
  });

  it("should create an user list", function () {
    var user = userList.list[0];
    expect(user._id).toEqual("id");
    expect(user.username).toEqual("username");
    expect(user.email).toEqual("email");
    user = userList.list[1];
    expect(user._id).toEqual("id2");
    expect(user.username).toEqual("username2");
    expect(user.email).toEqual("email2");
  });

  it("should load an object", function () {
    var userList = new modelUserList.UserList();
    userList.loadObject(obj);
    var user = userList.list[0];
    expect(user._id).toEqual("id");
    expect(user.username).toEqual("username");
    expect(user.email).toEqual("email");
    user = userList.list[1];
    expect(user._id).toEqual("id2");
    expect(user.username).toEqual("username2");
    expect(user.email).toEqual("email2");
  });

  it("should export an object", function () {
    expect(userList.exportObject()).toEqual(obj);
  });

  it("should delete a user", function () {
    var user = userList.list[0];
    userList.delete("id2");
    expect(userList.list.length).toEqual(1);
    expect(userList.list[0]).toEqual(user);
  });
});
