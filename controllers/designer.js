var Component = require("./component");
var Menu = require("./menu");
var template = require("./designer.hbs");
var tabMenuTemplate = require("./designerTabMenu.hbs");
var visualTab = require("./designerVisualTab.html");
var schemaTab = require("./designerSchemaTab.html");
import * as jsonSchema from "../model/jsonSchema";
var visualTabEnum = Symbol();
var schemaTabEnum = Symbol();
const abovePlacementEnum = "above";
const belowPlacementEnum = "below";

class Highlight {
  constructor(before,after,inside) {
    this.before = before;
    this.after = after;
    this.inside = inside;
  }
  any() {
    return this.before || this.after || this.inside;
  }
}

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
    this.drag = {};
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
      if (this.editor) {
        this.addControlListeners(null, this.editor.root);
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
  onDragEnd(event) {
    this.unHighlightSeparator();
  }
  addControlListeners(parent,editor) {
    console.log("add listeners to", editor.path);

    let highlight = new Highlight();
    if (parent && parent.schema.type == "object") {
      highlight.before = true;
      highlight.after = true;
    }
    if ((editor.schema.type == "object" || editor.schema.type == "array") && Object.keys(editor.editors).length <= 0) {
      highlight.inside = true;
    }
    editor.highlight = highlight;

    if (highlight.any()) {
      editor.container.ondragover = function (event) {
        if (event.dataTransfer.types[0] == "text/field") {
          this.highlightSeparator(event, editor.container, editor.highlight);
          this.drag[editor.path] = true;
          event.preventDefault();
          event.stopPropagation();
        }
      }.bind(this);

      editor.container.ondragleave = function (event) {
        if (event.dataTransfer.types[0] == "text/field") {
          delete this.drag[editor.path];
          if (Object.keys(this.drag).length <= 0) {
            this.unHighlightSeparator();
          }
        }
      }.bind(this);

      editor.container.ondrop = function (event) {
        if (event.dataTransfer.types[0] == "text/field") {
          event.preventDefault();
          event.stopPropagation();
        }
      };
    }

    for (let key in editor.editors) {
      this.addControlListeners(editor, editor.editors[key]);
    }
  }
  // calculate if placement should be above or below container
  claculatePlacement(event,rect) {
    let middleY = ((rect.bottom - rect.top) / 2) + rect.top;
    if (event.clientY < middleY) {
      return abovePlacementEnum;
    } else {
      return belowPlacementEnum;
    }
  }
  highlightSeparator(event,container,highlight) {
    if (highlight.before && highlight.after && highlight.inside) {

    } else if (highlight.before && highlight.after) {
      let sep = document.getElementById("separator");
      let rect = container.getBoundingClientRect();
      sep.style.height = "20px";
      sep.style.width = rect.width + "px";
      sep.style.backgroundColor = "rgba(128,128,128,0.5)";
      sep.style.position = "absolute";
      sep.style.left = rect.left + "px";
      if (this.claculatePlacement(event, rect) === abovePlacementEnum) {
        sep.style.top = (rect.top - 10) + "px";
      } else {
        sep.style.top = (rect.bottom - 10) + "px";
      }
    } else if (highlight.inside) {

    }
  }
  unHighlightSeparator() {
    let sep = document.getElementById("separator");
    sep.style.height = "";
    sep.style.width = "";
    sep.style.backgroundColor = "";
    sep.style.position = "";
    sep.style.left = "";
    sep.style.top = "";
  }
}

module.exports = Designer;
