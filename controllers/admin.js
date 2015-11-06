"use strict";
var view = require("./admin.html");
var datastore = require("../scripts/datastore");
var modelUserList = require("../model/userList");
var Component = require("./component");
var Menu = require("./menu");
var LoadError = require("./loadError");

class Admin extends Component {
  constructor(containerID) {
    super(containerID, "Grackle | Admin");
    this.global();
  }
  getAdmin(callback) {
    if (this.userList && this.expiredTable) {
      return callback();
    }

    datastore("GET", "userList", null, function (err,res) {
      if (err) {
        return callback(err);
      }

      this.userList = new modelUserList.UserList();
      this.userList.loadObject(res);

      datastore("GET", "getExpiredTable", null, function (err, res) {
        if (err) {
          return callback(err);
        }

        this.expiredTable = res;
        callback();
      }.bind(this));
    }.bind(this));
  }
  render(callback) {
    this.getAdmin(function (err) {
      if (err) {
        let c = new LoadError("main", "Admin", err);
        callback(err, c);
        return;
      }

      let menu = new Menu("", false, true);
      menu.render(function (err,menuView) {
        let template = Handlebars.compile(view);
        let adminHTML = template({userList:this.userList, expiredTable:this.expiredTable});
        callback(null, menuView + adminHTML);
      }.bind(this));
    }.bind(this));
  }
  clickDeleteUser(_id) {
    var user = this.userList.getUser(_id);
    $("#deleteHeader").html("Delete " + user.username);
    document.getElementById("deleteButton").onclick = function () {
      this.clickConfirmDeleteUser(_id);
    }.bind(this);
    $("#deleteModal").modal("show");
  }
  clickConfirmDeleteUser(_id) {
    var obj = {
      _id: _id
    };
    datastore("DELETE", "deleteUser", obj, function (err, obj) {
      if (err) {
        $("#placeForAlert").addClass("alert alert-warning");
        $("#placeForAlert").html(err);
        return;
      }

      this.userList.delete(_id);
      this.show();
    }.bind(this));
  }
  makeClickCleanup(apiPath,dbName) {
    return function () {
      datastore("DELETE", apiPath, null, function (err, obj) {
        if (err) {
          $("#placeForAlert").addClass("alert alert-warning");
          $("#placeForAlert").html(err);
          return;
        }

        $("#placeForAlert").removeClass("alert-warning");
        $("#placeForAlert").addClass("alert alert-success");
        $("#placeForAlert").html(dbName + " records deleted: " + obj.count);
      });
    };
  }
  clickCleanupReset() {
    this.makeClickCleanup("cleanupReset", "Reset")();
  }
  clickCleanupVerify() {
    this.makeClickCleanup("cleanupVerify", "Verify Email")();
  }
}

module.exports = Admin;
