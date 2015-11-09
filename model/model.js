"use strict";
function Model() {
  this.schema = {};
}
Model.prototype.exportObject = function (schema) {
  if (!schema) {
    schema = this.schema;
  }

  var ret = {};
  for (let name in schema) {
    if (this[name] !== undefined) {
      if (this[name].constructor === Array) {
        ret[name] = [];
        for (let item of this[name]) {
          let subObj = this.exportValue(item, schema[name]);
          ret[name].push(subObj);
        }
      } else {
        ret[name] = this.exportValue(this[name], schema[name]);
      }
    }
  }
  return ret;
};
Model.prototype.exportValue = function (value,type) {
  if (type === Date) {
    return value.toISOString();
  } else if (value && value.exportObject && value.schema) {
    return value.exportObject();
  } else {
    return value;
  }
};
Model.prototype.loadObject = function (obj, schema) {
  if (!schema) {
    schema = this.schema;
  }

  for (var name in schema) {
    if (obj[name] !== undefined) {
      if (obj[name].constructor === Array) {
        for (let item of obj[name]) {
          let subObj = this.loadValue(item, schema[name]);
          this[name].push(subObj);
        }
      } else {
        this[name] = this.loadValue(obj[name], schema[name]);
      }
    }
  }
  this.afterLoad();
};
Model.prototype.loadValue = function (value,Type) {
  if (Type == Date) {
    return new Date(value);
  } else if (Type && Type.prototype && Type.prototype.loadObject) {
    let t = new Type();
    t.loadObject(value);
    return t;
  } else {
    return value;
  }
};
Model.prototype.afterLoad = function () {};
Model.prototype.copySchema = function () {
  let s = JSON.stringify(this.schema);
  return JSON.parse(s);
};
Model.prototype.appendSchema = function (from,to) {
  for (let name in from) {
    if (typeof from[name] === "object") {
      if (!to[name]) {
        to[name] = {};
      }
      this.appendSchema(from[name],to[name]);
    } else {
      to[name] = from[name];
    }
  }
};
Model.prototype.unionSchema = function (a,b) {
  let ret = {};
  this.appendSchema(a,ret);
  this.appendSchema(b,ret);
  return ret;
};

exports.Model = Model;
