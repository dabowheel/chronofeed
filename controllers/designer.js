var Component = require("./component");
var Menu = require("./menu");
var template = require("./designer.hbs");
var tabMenuTemplate = require("./designerTabMenu.hbs");
var visualTab = require("./designerVisualTab.html");
var schemaTab = require("./designerSchemaTab.html");
import * as jsonSchema from "../model/jsonSchema";
const visualTabEnum = "visual";
const schemaTabEnum = "schema";
const placementNoneEnum = "";
const placementAboveEnum = "above";
const placementBelowEnum = "below";
const placementInsideEnum = "inside";
const DATA_TRANSFER_TYPE_DEFAULT = "text/plain";
const DATA_TRANSFER_TYPE_IE = "Text";

class Designer extends Component {
	constructor(containerID) {
		super(containerID, "Grackle | Designer");
		this.global();
    this.schema = {
      type: "object",
      title: "Form"
    };
    this.value = this.getInitialValue(this.schema);
    this.tab = visualTabEnum;
    this.dataTransferType = DATA_TRANSFER_TYPE_DEFAULT;
    this.scrollTop = 0;
    this.addedPath = "";
    this.objectNames = {};
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
    $("#main").addClass("gr-fill-parent");
    if (this.tab == visualTabEnum) {
      var form = document.getElementById("formTarget");
      var options = {
        theme: "bootstrap3",
        schema: this.schema,
        startval: this.value,
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
        $("#placeForAlert").addClass("alert alert-warning gr-alert");
        $("#placeForAlert").html(err);
      }
      if (this.editor) {
        this.addControlListeners(this.editor.root);
        document.getElementById("formScroll").scrollTop = this.scrollTop;
        this.scrollToAddedItem();
      }
    } else if (this.tab == schemaTabEnum) {
      document.getElementById("schemaText").value = JSON.stringify(this.schema, null, 2);
    }
  }
  clickVisualTab() {
    try {
      this.schema = JSON.parse(document.getElementById("schemaText").value);
    }
    catch (err) {
      $("#placeForAlert").addClass("alert alert-warning gr-alert");
      $("#placeForAlert").html(err);
    }
    this.value = this.getInitialValue(this.schema);
    this.tab = visualTabEnum;
    this.show();
  }
  clickSchemaTab() {
    this.tab = schemaTabEnum;
    this.value = this.editor.getValue();
    this.show();
    this.resizeSchemaText();
  }
  resizeSchemaText() {
    let el = document.getElementById("schemaText");
    let rect = el.getBoundingClientRect();
    el.style.height = el.parentElement.offsetHeight - 6 + "px";
  }
  getInitialValue(schema) {
    switch (schema.type) {
      case "string":
        return "";
      case "integer":
        return 0;
      case "number":
       return 0;
      case "boolean":
        return false;
      case "array":
        if (schema.items) {
          return [this.getInitialValue(schema.items)];
        } else {
          return [];
        }
        break;
      case "object":
        let ret = {};
        for (let key in schema.properties) {
          ret[key] = this.getInitialValue(schema.properties[key]);
        }
        return ret;
    }
  }
	onDragStart(event, fieldName) {
  	var dt = event.dataTransfer;
    try {
    	dt.setData(this.dataTransferType, fieldName);
    } catch (e) {
      this.dataTransferType = DATA_TRANSFER_TYPE_IE;
      dt.setData(this.dataTransferType, fieldName);
    }
	}
  onDragEnd(event) {
    this.drag = {};
    this.unHighlightSeparator();
  }
  // add drag and drop listeners
  addControlListeners(editor) {
    if (editor.schema.type == "object" || ((editor.schema.type == "array") && (editor.rows.length === 0))) {
      editor.dragging = 0;

      if (editor.schema.type == "object") {
        this.getObjectNames(editor.schema);
      }

      this.addBottomDropTarget(editor.container);

      editor.container.ondragover = function (event) {
        if (event.dataTransfer.types[0] == this.dataTransferType) {
          let {placement, child} = this.calculatePlacement(editor,event);
          this.highlight(placement, editor.container.getBoundingClientRect(), child ? child.container.getBoundingClientRect() : null);
          event.preventDefault();
          event.stopPropagation();
        }
      }.bind(this);

      editor.container.ondragenter = function(event) {
        if (event.dataTransfer.types[0] == this.dataTransferType) {
          editor.dragging++;
        }
        editor.container.ondragover(event);
      }.bind(this);

      editor.container.ondragleave = function (event) {
        if (event.dataTransfer.types[0] == this.dataTransferType) {
          editor.dragging--;
          if (editor.dragging <= 0) {
            this.unHighlightSeparator();
          }
        }
      }.bind(this);

      editor.container.ondrop = function (event) {
        if (event.dataTransfer.types[0] == this.dataTransferType) {
          editor.dragging = 0;
          this.unHighlightSeparator();
          let {placement, child} = this.calculatePlacement(editor, event);
          let data = event.dataTransfer.getData(this.dataTransferType);
          this.addItem(data,editor,placement,child);
          event.preventDefault();
          event.stopPropagation();
        }
      }.bind(this);
    }

    if (editor.schema.type == "object") {
      for (let key in editor.editors) {
        this.addControlListeners(editor.editors[key]);
      }
    } else if (editor.schema.type == "array") {
      if (editor.rows[0]) {
        this.addControlListeners(editor.rows[0]);
      }
    }


  }
  // gives an area in container where the use can drop an item
  addBottomDropTarget(container) {
    let t = document.createElement("div");
    t.style.height = "10px";
    container.appendChild(t);
  }
  // calculate if placement should be above or below container
  calculatePlacement(editor,event) {
    let placement = placementNoneEnum;
    let child = null;

    // array with no child
    if (editor.schema.type == "array" && (!editor.editors || Object.keys(editor.editors).length === 0)) {
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
  addItem(type,editor,placement,child) {
    let schema = JSON.parse(JSON.stringify(this.editor.schema));
    let parentSchema = this.getSchema(schema,editor.path);
    let itemSchema = {
      type: type
    };
    if (parentSchema.type == "object") {
      let name = this.getNewPropertyName(parentSchema.properties,type);
      this.addedPath = editor.path + "." + name;
      if (!parentSchema.properties) {
        parentSchema.properties = {};
      }
      parentSchema.properties[name] = itemSchema;
      if (child) {
        let childOrder = editor.property_order.length;
        for (let i = 0; i < editor.property_order.length; i++) {
          if (editor.property_order[i] == child.key) {
            childOrder = i;
            break;
          }
        }
        let new_property_order = editor.property_order.splice(0);
        if (placement == placementAboveEnum) {
          new_property_order.splice(childOrder, 0, name);
        } else {
          new_property_order.splice(childOrder+1, 0, name);
        }
        for (let i = 0; i < new_property_order.length; i++) {
          parentSchema.properties[new_property_order[i]].propertyOrder = i;
        }
      }
    } else if (parentSchema.type == "array") {
      parentSchema.items = itemSchema;
      this.addedPath = editor.path + ".0";
    }
    this.schema = schema;
    this.value = this.getInitialValue(schema);
    this.scrollTop = document.getElementById("formScroll").scrollTop;
    this.show();
  }
  scrollToAddedItem() {
    if (this.addedPath) {
      let container = this.editor.editors[this.addedPath].container;
      if (!this.isElementInViewport(container)) {
        container.scrollIntoView();
      }
    }
  }
  isElementInViewport (el) {
    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
  }
  getNewPropertyName(properties,type) {
    for (let i = 1; ; i ++) {
      let name = type + i;
      if (!this.objectNames.hasOwnProperty(name)) {
        return name;
      }
    }
  }
  getSchema(schema,path) {
    let pathArray = path.split(".");
    for (let i = 1; i < pathArray.length; i++) {
      if (schema.type == "object") {
        let name = pathArray[i];
        schema = schema.properties[name];
      } else if (schema.type == "array") {
        schema = schema.items;
      }
    }
    return schema;
  }
  getObjectNames(schema) {
    for (let name in schema.properties) {
      this.objectNames[name] = true;
    }
  }
}

module.exports = Designer;
