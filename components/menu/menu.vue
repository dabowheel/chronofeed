<template>
  <nav class="navbar navbar-default">

    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="/loglist.html">ChronoFeed</a>
      </div>
      <div class="collapse navbar-collapse" id="myNavbar">
        <ul class="nav navbar-nav" id="navBar">
          <li v-if="islog || isdesigner" v-bind:class="{'active': islog}"><a href="/log/{{encodeURIComponent(logtitle)}}/">{{logtitle}}</a></li>
          <li v-if="isdesigner" v-bind:class="{'active': isdesigner}"><a href="/log/{{encodeURIComponent(logtitle)}}/designer/">Designer</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li v-bind:class="{'active': isProfile}"><a href="/profile.html" title="profile"><span class="glyphicon glyphicon-user"> Profile<span></a></li>
          <li v-bind:class="{'active': isAdmin}"><a href="/admin.html">Admin</a></li>
          <li><a href="/logout/" onclick="return false;" v-on:click="clickLogout();"><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>
        </ul>
      </div>
    </div>
  
  </nav>

  <div v-if="err" class="row">
    <div class="col-mid-4 col-lg-4 alert alert-danger">{{err.message ? err.message : err}}</div>
  </div>
</template>

<script>
  module.exports = {
    data: function () {
      return {
        err: ""
      };
    },
    props: ["islog","logtitle","isdesigner"],
    ready: function () {
      global.menuVM = this;
    },
    methods: {
      clickLogout() {
        chronofeed.request("GET", "/api/logout/", null).then(function () {
          location.assign("/");
        }).catch(function (err) {
          this.err = err;
        });
      }
    }
  };
</script>