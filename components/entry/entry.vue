<template>
  <div id="entryData{{index}}">
  </div>
  <div>{{entry.date | moment}}</div>
</template>

<script>
  export default {
    props: ["log", "index", "entry"],
    ready: function () {
      let parent = document.getElementById("entryData" + this.index);
      let summary = [];
      this.addType(summary, "", this.log.schema, this.entry.data);
      parent.textContent = summary.join(" ");
    },
    methods: {
      addType: function (summary,propName,schema,value) {
        if (!value) return;
        
        switch (schema.type) {
          case "string":
          case "integer":
          case "number":
          case "boolean":
            this.addSimple(summary, propName, schema, value);
            break;
          case "array":
            this.addArray(summary, propName, schema, value);
            break;
          case "object":
            this.addObject(summary, propName, schema, value);
            break;
          default:
            this.addSimple(summary, propName, schema, value);
            break;
        }
      },
      addSimple: function (summary,propName,schema,value) {
        if (schema.type == "boolean") {
          if (value) {
            summary.push((schema.title || propName || "").replace(/\?$/,""));
          }
        } else {
          summary.push(value);
        }
      },
      addArray: function (summary,propName,schema,value) {
        for (let i = 0; i < value.length; i++) {
          this.addType(summary, "item " + i, schema.items, value[i]);
        }
      },
      addObject: function (summary,propName,schema,value) {
        let sortOrder = this.getPropertyOrder(schema);
        for (let x of sortOrder) {
          this.addType(summary, x, schema.properties[x], value[x]);
        }
      },
      getPropertyOrder: function (schema) {
        let ret = [];
        for (let x in schema.properties) {
          ret.push(x);
        }
        ret.sort(function (a,b) {
          return schema.properties[a].propertyOrder - schema.properties[b].propertyOrder;
        });
        return ret;
      }
    }
  };
</script>
