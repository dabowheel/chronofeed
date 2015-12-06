<template>
  <nav class="navbar navbar-default">

    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="javascript:void(0)" onclick="component.Menu.clickBlogList();">ChronoFeed</a>
      </div>
      <div class="collapse navbar-collapse" id="myNavbar">
        <ul class="nav navbar-nav" id="navBar">
          <li v-if="isLog || isDesigner" v-bind:class="{'active': isLog}"><a href="/log/{{title}}/">{{title}}</a></li>
          <li v-if="isDesigner" v-bind:class="{'active': isDesigner}"><a href="/log/{{title}}/designer/">Designer</a></li>
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
    data: {
      isProfile: false,
      isAdmin: false,
      isLog: false,
      isDesigner: false,
      logTitle: "",
      err: ""
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