var Component = require("./component");
var Menu = require("./menu");
var template = require("./designer.hbs");
var tabMenuTemplate = require("./designerTabMenu.hbs");
var visualTab = require("./designerVisualTab.html");
var schemaTab = require("./designerSchemaTab.html");
import * as jsonSchema from "../model/jsonSchema";
var visualTabEnum = Symbol();
var schemaTabEnum = Symbol();

class Designer extends Component {
	constructor(containerID) {
		super(containerID, "Grackle | Designer");
		this.global();
    this.schema = {
      type: "object",
      title: "Form",
      properties: {
        name: {
          type: "string",
          title: "Name"
        },
        count: {
          type: "integer",
          title: "Count"
        },
        unit: {
          type: "string",
          title: "Unit"
        }
      },
      "defaultProperties": ["name", "count", "unit"]
    };
    this.value = {
      name: "",
      count: 0,
      unit: ""
    };
    this.tab = visualTabEnum;
	}
	render(callback) {
		let menu = new Menu("", false, false, true, false, " gr-no-margin-bottom");
		menu.render(function (err, menuView) {
      var tabMenuContext = {};
      var tabView = "";
      if (this.tab == visualTabEnum) {
        tabView = visualTab;
        tabMenuContext.isVisualTab = true;
      } else if (this.tab == schemaTabEnum) {
        tabView = schemaTab;
        tabMenuContext.isSchemaTab = true;
      }
			var view = template({theMenu:menuView,tabMenu:tabMenuTemplate(tabMenuContext),tab:tabView});
			callback(null, view);
		}.bind(this));
	}
  afterLoad() {
    if (this.tab == visualTabEnum) {
      var form = document.getElementById("formTarget");
      var options = {
        theme: "bootstrap3",
        schema: this.schema,
        startval: this.value
      };
      try {
        this.editor = new JSONEditor(form,options);
      } catch (err) {
        $("#placeForAlert").addClass("alert alert-warning gr-alert");
        $("#placeForAlert").html(err);
      }
    } else if (this.tab == schemaTabEnum) {
      document.getElementById("schemaText").value = JSON.stringify(this.schema, null, 2);
    }
  }
  clickVisualTab() {
    try {
      this.schema = JSON.parse(document.getElementById("schemaText").value);
    }
    catch (e) {
    }
    this.tab = visualTabEnum;
    this.show();
  }
  clickSchemaTab() {
    this.tab = schemaTabEnum;
    this.value = this.editor.getValue();
    this.show();
  }
	onDragStart(event, fieldName) {
  	var dt = event.dataTransfer;
  	dt.setData("text/field", fieldName);
	}

  onDragOver(event) {
 		if (event.dataTransfer.types[0] == "text/field") {
    	var target = document.getElementById("formTarget");
    	target.style.border = "1px solid blue";
    	event.preventDefault();
  	}
	}
	onDragLeave(event) {
  	if (event.dataTransfer.types[0] == "text/field") {
    	var target = document.getElementById("formTarget");
    	target.style.border = "1px solid rgba(0,0,0,0.0)";
  	}
	}

	onDrop(event) {
  	if(event.dataTransfer.types[0] == "text/field") {
  		var target = document.getElementById("formTarget");
    	target.innerHTML += event.dataTransfer.getData("text/field") + "<br>";
    	target.style.border = "1px solid rgba(0,0,0,0.0)";
    	target.scrollTop = event.target.scrollHeight;
    	event.preventDefault();
  	}
	}
}

module.exports = Designer;
