"use strict";

global.jQuery = require("jquery");
global.$ = global.jQuery;
require("../node_modules/bootstrap/dist/js/bootstrap");
require("../public/bower_components/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker");
require("../css/blog.css");
require("babel-polyfill");
import route from "./route";

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
