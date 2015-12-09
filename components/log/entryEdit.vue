<template>
  <div><strong>Edit</strong></div>

  <div class="form-group">
    <div class='input-group date cf-input-group' id='datetimepicker'>
      <input type='text' class="form-control cf-form-group" />
      <span class="input-group-addon cf-input-group-addon">
        <span class="glyphicon glyphicon-calendar"></span>
      </span>
    </div>
  </div>

  <div class="cf-row-buttons">
    <button class="btn btn-primary cf-hotkey" v-on:click="saveEntryChanges();" accesskey="a">Accept</button>
    <button class="btn btn-primary cf-hotkey" v-on:click="cancelEntryChanges();" accesskey="c">Cancel</button>
  </div>
</template>

<script>
  export default {
    props: ["log", "entry"],
    events: {
      initDateTimePicker: function () {
        this.initDateTimePicker();
      }
    },
    methods: {
      saveEntryChanges() {
        this.getDateTime(this.entry);
        this.entry.edit = false;
        if (this.entry._id) {
          chronofeed.request("POST", "/api/entry/" + this.log._id + "/" + this.entry._id + "/", this.cleanupEntry(this.entry)).then(function () {
          }).catch(function (err) {
            this.$dispatch("error", err);
          });
        } else {
          chronofeed.request("PUT", "/api/entry/" + this.log._id + "/", this.cleanupEntry(this.entry)).then(function (result) {
            entry._id = result._id;
          }).catch(function (err) {
            this.$dispatch("error", err);
          }.bind(this));
        }
      },
      cancelEntryChanges() {
        this.entry.edit = false;
      },
      cleanupEntry() {
        let newEntry = Object.assign({}, this.entry);
        delete newEntry.edit;
        return newEntry;
      },
      initDateTimePicker() {
        $('#datetimepicker').datetimepicker();
        $("#datetimepicker").data("DateTimePicker").date(this.entry.date);
      },
      getDateTime() {
        this.entry.date = $("#datetimepicker").data("DateTimePicker").date();
      }
    }
  };
</script>
