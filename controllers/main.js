"use strict";
import route from "./route";

require("../css/blog.css");
require("babel-polyfill");

global.clearComponents = function() {
  global.component = {};
  global.component.All = {};
  global.component.All.blogs = [];
  global.compPath = {};
};
global.clearComponents();

window.onpopstate = function (e) {
  route(decodeURI(location.pathname));
};

window.onhashchange = function () {
  route(decodeURI(location.pathname));
};

global.loadAll = function () {
  if (global.liveReload) {
    global.liveReload();
  }
  route(decodeURI(location.pathname));
};
