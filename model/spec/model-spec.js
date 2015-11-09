"use strict";
let model = require("../model");

describe("model", function () {
  it("should append schema", function () {
    let m = new model.Model();
    let from = {
      name: "string",
      title: "string"
    };
    let to = {
      dog: "string"
    };
    m.appendSchema(from, to);
    expect(to).toEqual({
      name: "string",
      title: "string",
      dog: "string"
    });
  });

  it ("should union schema", function () {
    let m = new model.Model();
    let from = {
      name: "string",
      title: "string"
    };
    let to = {
      dog: "string"
    };
    let ret = m.unionSchema(from, to);
    expect(ret).toEqual({
      name: "string",
      title: "string",
      dog: "string"
    });
  });
});
