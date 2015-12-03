"use strict";
var designer = require('./designer.vue');
var VueAsyncData = require("vue-async-data");
Vue.use(VueAsyncData);

global.vm = new Vue({
  el: '#main',
  components: {
    designer: designer
  }
});

global.designerVM = global.vm.$children[0];
