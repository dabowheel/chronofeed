<style>
  .gr-not-verified {
    color: orange;
  }
  .gr-verify-email {
    position: relative;
    top: -5px;
  }
</style>

<template>
  <div class="container">
    <menu is-profile="true"></menu>

    <h1>{{username}}</h1>



    <p>Joined: {{joined | moment}}</p>

    <div class="row">

      <div v-if="emailVerifed" class="col-md-3 col-lg-3">
        <div class="form-group">
          <label class="control-label" for="inputEmail" id="labelEmail">Email Address</label>
          <input class="form-control" id="inputEmail" tabindex="1" type="text" placeholder="Enter your email address" value="{{email}}">
        </div>
      </div>

      <div v-if="!emailVerified" class="col-md-3 col-lg-3">
        <div class="form-group">
          <label class="control-label" for="inputEmail" id="labelEmail">Email Address</label>
          <span class="gr-not-verified">Not Verified</span>
          <div class="gr-verify-email">
            <a href="/profile" onclick="return false" v-on:click="clickResendVerification" tabindex="1" title="Resend a verification email">Resend verification?</a>
          </div>
          <input class="form-control" id="inputEmail" tabindex="2" type="text" placeholder="Enter your email address" value="{{email}}">
        </div>
      </div>

    </div>

    <div class="row">
      <div class="col-md-4 col-lg-3">
        <div class="form-group" id="inputPasswordFormGroup">
          <label class="control-label" for="inputPassword">New Password</label>
          <input class="form-control" tabindex="3" id="inputPassword" type="password">
        </div>
      </div>
    </div>

    <div v-if="err" class="row">
      <div class="col-lg-6">
        <div class="alert alert-danger">
          {{err.message ? err.message : err}}
        </div>
      </div>
    </div>

    <div v-if="success" class="row">
      <div class="col-lg-6">
        <div class="alert alert-success">
          {{success}}
        </div>
      </div>
    </div>

    <button class="btn btn-primary" tabindex="4" type="button" v-on:click="clickSave();" id="saveButton">Save</button>
  </div>
</template>

<script>
  Vue.filter("moment", function (value) {
    return moment(value).format("MM/DD/YYYY");
  });

  export default {
    components: {
      menu: require("../menu/menu.vue")
    },
    data: function () {
      return {
        username: "",
        email: "",
        joined: null,
        emailVerified: false,
        err: "",
        success: ""
      };
    },
    asyncData: function () {
      return chronofeed.request("GET", "/api/profile/", null).then(function (result) {
        return {
          username: result.username,
          email: result.email,
          joined: new Date(result.joined),
          emailVerified: result.emailVerified
        };
      }).catch(function (err) {
        return {
          err: err
        };
      });
    },
    events: {
      "async-data": function () {
        chronofeed.requireFields(["inputEmail"], "saveButton");
        chronofeed.triggerOnEnter(["inputEmail", "inputPassword"], this.clickSave.bind(this));
      }
    },
    methods: {
      getPasswordPlain() {
        return document.getElementById("inputPassword").value;
      },
      getValues() {
        let sha256 = chronofeed.createHash("sha256");
        return {
          email: document.getElementById("inputEmail").value,
          password: this.getPasswordPlain().length > 0 ? sha256.update(this.getPasswordPlain(),"utf8").digest("hex") : ""
        };
      },
      validateProfileForm(values, passwordPlain) {
        var valid = true;

        if (values.email === "") {
          $("#inputEmailFormGroup").addClass("has-error");
          valid = false;
        } else {
          $("#inputEmailFormGroup").removeClass("has-error");
        }

        if (passwordPlain.length > 0 && passwordPlain.length < 8) {
          $("#inputPasswordFormGroup").addClass("has-error");
          this.err = "Password length must be at least 8 characters.";
          valid = false;
        } else {
          $("#inputPasswordFormGroup").removeClass("has-error");
        }

        return valid;
      },
      clickSave() {
        var values = this.getValues();
        if (!this.validateProfileForm(values, this.getPasswordPlain())) {
          return;
        }

        chronofeed.request("POST", "Profile", values).then(function (result) {
          if (result.checkEmail) {
            this.emailVerified = false;
            this.success = "Saved. Check your email for a message to verify your email address.";
          } else {
            this.success = "Saved.";
          }
        }.bind(this)).catch(function (err) {
          this.err = err;
        }.bind(this));
      },
      clickResendVerification() {
        chronofeed.request("GET", "resendVerification", null).then(function () {
          this.success = "A verfication message was sent to your email address. Check your email to verify that you recieved it.";
        }.bind(this)).catch(function (err) {
          this.err = err;
        }.bind(this));
      }
    }
  };
</script>
