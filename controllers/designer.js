var Component = require("./component");
var Menu = require("./menu");
var template = require("./designer.hbs");
var tabMenuTemplate = require("./designerTabMenu.hbs");
var visualTab = require("./designerVisualTab.html");
var schemaTab = require("./designerSchemaTab.html");
import * as jsonSchema from "../model/jsonSchema";
var visualTabEnum = Symbol();
var schemaTabEnum = Symbol();
const placementNoneEnum = "";
const placementAboveEnum = "above";
const placementBelowEnum = "below";
const placementInsideEnum = "inside";

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
        this.addControlListeners(this.editor.root);
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
    this.drag = {};
    this.unHighlightSeparator();
  }
  // add drag and drop listeners
  addControlListeners(editor) {
    if (editor.schema.type == "object" || ((editor.schema.type == "array") && (Object.keys(editor.editors).length === 0))) {
      console.log("add listeners to", editor.path);

      editor.container.ondragover = function (event) {
        if (event.dataTransfer.types[0] == "text/field") {
          let {placement, child} = this.calculatePlacement(editor,event);
          this.highlight(placement, editor.container.getBoundingClientRect(), child ? child.container.getBoundingClientRect() : null);
          this.drag[editor.path] = true;
          event.preventDefault();
          event.stopPropagation();
        }
      }.bind(this);

      editor.container.ondragleave = function (event) {
        if (event.dataTransfer.types[0] == "text/field") {
          delete this.drag[editor.path];
          if (Object.keys(this.drag).length === 0) {
            if (!this.inContainer(event, editor.container))
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
      this.addControlListeners(editor.editors[key]);
    }
  }
  // calculate if placement should be above or below container
  calculatePlacement(editor,event) {
    let placement = placementNoneEnum;
    let child = null;

    // array with no child
    if (editor.schema.type == "array" && Object.keys(editor.editors).length === 0) {
      placement = placementInsideEnum;
    // object with no children
    } else if (editor.schema.type == "object" && Object.keys(editor.editors).length === 0) {
      placement = placementInsideEnum;
    // object with children
    } else if (editor.schema.type == "object") {
      // find child event is in
      for (let key in editor.editors) {
        if (this.inContainer(event, editor.editors[key].container)) {
          child = editor.editors[key];
          break;
        }
      }
      // otherwise, find child closest to event
      if (!child) {
        let minDist = 0.0;
        let minChild = null;
        for (let key in editor.editors) {
          let d = this.getDistance(event, editor.editors[key].container);
          if ((minChild === null) || (d < minDist)) {
            minDist = d;
            minChild = editor.editors[key];
          }
        }
        child = minChild;
      }

      let rect = child.container.getBoundingClientRect();
      let middleY = ((rect.bottom - rect.top) / 2) + rect.top;
      if (event.clientY < middleY) {
        placement = placementAboveEnum;
      } else {
        placement = placementBelowEnum;
      }
    }

    return {
      placement: placement,
      child: child
    };
  }
  inContainer(event,container) {
    let rect = container.getBoundingClientRect();
    if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) {
      return true;
    } else {
      return false;
    }
  }
  getDistance(event,container) {
    // middle of container
    let rect = container.getBoundingClientRect();
    let containerX = (rect.right - rect.left) / 2 + rect.left;
    let containerY = (rect.bottom - rect.top) / 2 + rect.top;
    return Math.sqrt(Math.pow(event.clientX - containerX, 2) + Math.pow(event.clientY - containerY, 2));
  }
  highlight(placement,parentRect,childRect) {
    let sep = document.getElementById("separator");
    sep.style.backgroundColor = "rgba(128,128,128,0.5)";
    sep.style.position = "absolute";
    sep.style.left = parentRect.left + "px";
    sep.style.width = parentRect.width + "px";

    switch (placement) {
      case placementInsideEnum:
        sep.style.top = parentRect.top + "px";
        sep.style.height = parentRect.height + "px";
        break;
      case placementAboveEnum:
        sep.style.height = "20px";
        sep.style.top = (childRect.top - 10) + "px";
        break;
      case placementBelowEnum:
        sep.style.height = "20px";
        sep.style.top = (childRect.bottom - 10) + "px";
        break;
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
