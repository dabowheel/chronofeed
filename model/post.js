var dateUtil = require("./dateUtil");

function Post(_id,title,text,date,blogID,domID) {
  this.load(_id, title, text, date, blogID, domID);
}
Post.prototype.load = function (_id,title,text,date,blogID,domID) {
  this._id = _id;
  this.title = title;
  this.text = text;
  this.date = date;
  if (this.date) {
    this.dateString = dateUtil.toDateString(this.date);
    this.dateOnly = dateUtil.getInputDateValue(this.date);
    this.timeOnly = dateUtil.getInputTimeValue(this.date);
    this.dbDateString = dateUtil.toDBDateString(this.date);
  }
  this.blogID = blogID;
  this.domID = domID;
};
Post.prototype.loadObject = function (post) {
  this.load(post._id, post.title, post.text, new Date(post.date), post.blogID, post.domID);
};
Post.prototype.exportObject = function (noID, noDOMID) {
  var ret = {
    _id: this._id,
    title: this.title,
    text: this.text,
    date: this.dateString,
    blogID: this.blogID,
    domID: this.domID
  };

  if (noID) {
    delete ret._id;
  }

  if (noDOMID) {
    delete ret.domID;
  }

  return ret;
};

exports.Post = Post;
