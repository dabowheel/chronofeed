"use strict";
var loglist = require('./loglist.vue');
var VueAsyncData = require("vue-async-data");
Vue.use(VueAsyncData);

global.vm = new Vue({
  el: 'body',
  components: {
    loglist: loglist
  }
});
