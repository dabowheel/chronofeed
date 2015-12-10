<template>
  <div id="form"></div>

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
    props: ["log", "entryList", "index", "entry"],
    events: {
      initDateTimePicker: function () {
        this.initDateTimePicker();
      }
    },
    ready: function () {
      this.extendEditorTheme();
      this.createJSONEditor();
    },
    methods: {
      createJSONEditor() {
        let form = document.getElementById("form");
        let options = {
          theme: "chronofeed",
          schema: this.log.schema,
          startval: this.getInitialValue(this.log.schema, this.entry.data),
          disable_edit_json: true,
          disable_properties: true,
          disable_array_add: true,
          disable_array_delete: true,
          disable_array_reorder: true,
          disable_collapse: true
        };
        try {
          this.editor = new JSONEditor(form,options);
        } catch (err) {
          this.$dispatch("error", err);
        }
      },
      extendEditorTheme() {
        JSONEditor.defaults.themes.chronofeed = JSONEditor.defaults.themes.bootstrap3.extend({
          getTextareaInput: function () {
            let el = this._super();
            el.style.height = "300px";
            el.style.resize = "none";
            return el;
          }
        });
      },
      getInitialValue(schema, value) {
        switch (schema.type) {
          case "string":
            if (value) {
              return value;
            } else if (schema.default) {
              return schema.default;
            }
            return "";
          case "integer":
            if (value) {
              return value;
            } else if (schema.default) {
              return schema.default;
            }
            return 0;
          case "number":
            if (value) {
              return value;
            } else if (schema.default) {
              return schema.default;
            }
            return 0;
          case "boolean":
            if (value) {
              return value;
            } else if (schema.default) {
              return schema.default;
            }
            return false;
          case "array":
            if (value && schema.items) {
              let ret = [];
              for (let i = 0; i < value.length; i++) {
                ret[i] = this.getInitialValue(schema.items, value[i]);
              }
              return ret;
            } else if (schema.items) {
              return [this.getInitialValue(schema.items)];
            } else {
              return [];
            }
            break;
          case "object":
            let ret = {};
            for (let key in schema.properties) {
              ret[key] = this.getInitialValue(schema.properties[key], value ? value[key] : undefined);
            }
            return ret;
        }
      },
      saveEntryChanges() {
        this.getDateTime(this.entry);
        this.entry.data = this.editor.getValue();
        if (this.entry._id) {
          chronofeed.request("POST", "/api/entry/" + this.log._id + "/" + this.entry._id + "/", this.cleanupEntry(this.entry)).then(function () {
            this.$dispatch("save");
            this.entry.edit = false;
          }.bind(this)).catch(function (err) {
            this.$dispatch("save");
            this.$dispatch("error", err);
            this.entry.edit = false;
          }.bind(this));
        } else {
          chronofeed.request("PUT", "/api/entry/" + this.log._id + "/", this.cleanupEntry(this.entry)).then(function (result) {
            this.entry._id = result._id;
            this.$dispatch("save");
            this.entry.edit = false;
          }.bind(this)).catch(function (err) {
            this.$dispatch("save");
            this.$dispatch("error", err);
            this.entry.edit = false;
          }.bind(this));
        }
      },
      cancelEntryChanges() {
        if (this.entry._id) {
          this.entry.edit = false;
        } else {
          this.entryList.splice(this.index, 1);
        }
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
