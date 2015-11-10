"use strict";
var model = require("./model");
let moment = require("moment");

function Post(_id,title,text,date,blogID,domID) {
  model.Model.call(this);
  this._id = _id;
  this.title = title;
  this.text = text;
  this.date = date;
  this.blogID = blogID;
  this.domID = domID;
  this.afterLoad();
  this.schema = {
    _id: "string",
    title: "string",
    text: "string",
    date: Date,
    blogID: "string"
  };
}
Post.prototype = new model.Model();
Post.prototype.constructor = Post;
Post.prototype.afterLoad = function () {
  if (this.date) {
    this.dateString = moment(this.date).format("MM/DD/YYYY h:mm A");
    this.dateISOString = this.date.toISOString();
  }
};

exports.Post = Post;
