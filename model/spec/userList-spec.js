var modelUserList = require("../userList");
var dateUtil = require("../dateUtil");

describe("user", function () {
  var joinedDate = new Date();
  var obj = {
    _id: "id",
    username: "username",
    email: "email",
    emailVerified: true,
    joinedDate: dateUtil.toDateString(joinedDate)
  };
  var user;

  beforeEach(function () {
    user = new modelUserList.User(obj._id, obj.username, obj.email, obj.emailVerified, joinedDate);
  });

  it("should create a user", function () {
    expect(user._id).toEqual(obj._id);
    expect(user.username).toEqual(obj.username);
    expect(user.email).toEqual(obj.email);
    expect(user.emailVerified).toEqual(obj.emailVerified);
    expect(user.joinedDate).toEqual(joinedDate);
    expect(user.joinedDateString).toEqual(obj.joinedDate);
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
  var joinedDate1 = new Date("1/1/2000");
  var joinedDate2 = new Date("1/2/2000");
  var userObj1 = {
    _id: "id",
    username: "username",
    email: "email",
    emailVerified: true,
    joinedDate: dateUtil.toDateString(joinedDate1)
  };
  var userObj2 = {
    _id: "id2",
    username: "username2",
    email: "email2",
    emailVerified: false,
    joinedDate: dateUtil.toDateString(joinedDate2)
  };
  var obj = {
    list: [userObj1, userObj2]
  };

  var userList;

  beforeEach(function () {
    userList = new modelUserList.UserList();
    userList.add(new modelUserList.User("id", "username", "email", true, joinedDate1));
    userList.add(new modelUserList.User("id2", "username2", "email2",false, joinedDate2));
  });

  it("should create an user list", function () {
    var user = userList.list[0];
    expect(user._id).toEqual("id");
    expect(user.username).toEqual("username");
    expect(user.email).toEqual("email");
    expect(user.emailVerified).toEqual(true);
    expect(user.joinedDate).toEqual(joinedDate1);
    expect(user.joinedDateString).toEqual(dateUtil.toDateString(joinedDate1));
    user = userList.list[1];
    expect(user._id).toEqual("id2");
    expect(user.username).toEqual("username2");
    expect(user.email).toEqual("email2");
    expect(user.emailVerified).toEqual(false);
    expect(user.joinedDate).toEqual(joinedDate2);
    expect(user.joinedDateString).toEqual(dateUtil.toDateString(joinedDate2));
  });

  it("should load an object", function () {
    var userList = new modelUserList.UserList();
    userList.loadObject(obj);
    var user = userList.list[0];
    expect(user._id).toEqual("id");
    expect(user.username).toEqual("username");
    expect(user.email).toEqual("email");
    expect(user.emailVerified).toEqual(true);
    expect(user.joinedDate).toEqual(joinedDate1);
    expect(user.joinedDateString).toEqual(dateUtil.toDateString(joinedDate1));
    user = userList.list[1];
    expect(user._id).toEqual("id2");
    expect(user.username).toEqual("username2");
    expect(user.email).toEqual("email2");
    expect(user.emailVerified).toEqual(false);
    expect(user.joinedDate).toEqual(joinedDate2);
    expect(user.joinedDateString).toEqual(dateUtil.toDateString(joinedDate2));
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
