"use strict";
var log = require('./log.vue');
var VueAsyncData = require("vue-async-data");
Vue.use(VueAsyncData);

global.vm = new Vue({
  el: 'body',
  components: {
    log: log
  }
});

global.logVM = global.vm.$children[0];
