"use strict";
let profile = require("./profile.vue");
var VueAsyncData = require("vue-async-data");
Vue.use(VueAsyncData);

global.vm = new Vue({
  el: "body",
  components: {
    profile: profile
  }
});

global.profileVM = global.vm.$children[0];
