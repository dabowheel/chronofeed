"use strict";

global.jQuery = require("jquery");
global.$ = global.jQuery;
require("../bower_components/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker");
require("../bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css");
require("../assets/css/blog.css");
require("../bower_components/json-editor/dist/jsoneditor.js");
require("babel-polyfill");
import route from "./route";
let timelog = require("./timelog");
global.Vue = require("../node_modules/vue/dist/vue");

global.clearComponents = function() {
  global.component = {};
  global.component.All = {};
  global.component.All.blogs = [];
  global.compPath = {};
  timelog.init();
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
