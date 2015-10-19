function getInputDateValue(d) {
  return d.getFullYear() + "-" + ((d.getMonth()+1)<10?"0":"") + (d.getMonth()+1) + "-" + (d.getDate()<10?"0":"") + d.getDate();
}
function getInputTimeValue(d) {
  return ((d.getHours()<10)?"0":"") + d.getHours() + ":" + ((d.getMinutes()<10)?"0":"") + d.getMinutes();
}
function toDateString(d) {
  if (global.navigator) {
    return d.toLocaleDateString() + " " + d.toLocaleTimeString(global.navigator.language,{hour:"2-digit",minute:"2-digit"});
  } else {
    return d.toString();
  }
}
function toDBDateString(d) {
  return getInputDateValue(d) + " " + getInputTimeValue(d);
}

function Post(_id,title,text,date,blogID,domID) {
  this.load(_id, title, text, date, blogID, domID);
}
Post.prototype.load = function (_id,title,text,date,blogID,domID) {
  this._id = _id;
  this.title = title;
  this.text = text;
  this.date = date;
  if (this.date) {
    this.dateString = toDateString(this.date);
    this.dateOnly = getInputDateValue(this.date);
    this.timeOnly = getInputTimeValue(this.date);
    this.dbDateString = toDBDateString(this.date);
  }
  this.blogID = blogID;
  this.domID = domID;
};
Post.prototype.loadObject = function (post) {
  this.load(post._id, post.title, post.text, new Date(post.date), post.blogID, post.domID);
};
Post.prototype.exportObject = function () {
  return {
    _id: this._id,
    title: this.title,
    text: this.text,
    date: this.dateString,
    blogID: this.blogID,
    domID: this.domID
  };
};

exports.Post = Post;
