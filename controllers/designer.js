var Component = require("./component");
var Menu = require("./menu");
var template = require("./designer.hbs");
var tabMenuTemplate = require("./designerTabMenu.hbs");
var visualTab = require("./designerVisualTab.html");
var schemaTab = require("./designerSchemaTab.html");
import * as jsonSchema from "../model/jsonSchema";
var validate = require("../scripts/validate");
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
    this.nearTopEdgeTime = 0;
    this.nearBottomEdgeTime = 0;
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
  beforeLoad() {
    this.value = this.getInitialValue(this.schema);
    let formScroll = document.getElementById("formScroll");
    if (formScroll) {
      this.scrollTop = formScroll.scrollTop;
    }
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
    this.unHighlightSeparator();
  }
  // add drag and drop listeners
  addControlListeners(editor) {
    if (editor.path != "root") {
      this.addEditControl(editor, editor.schema, editor.path, editor.container);
    }

    this.makeDraggable(editor);

    if (editor.schema.type == "object" || ((editor.schema.type == "array") && (editor.rows.length === 0))) {
      editor.dragging = 0;

      if (editor.schema.type == "object") {
        this.getObjectNames(editor.schema);
      }

      this.addBottomDropTarget(editor.container);

      editor.container.ondragover = function (event) {
        if (event.dataTransfer.types[0] == this.dataTransferType) {
          this.nearEdgeScroll(event);

          let {placement, child} = this.calculatePlacement(editor,event);
          let childRect = child ? child.container.getBoundingClientRect() : null;
          let highlightRect = this.calculateHighlight(placement, editor.container.getBoundingClientRect(), childRect);
          let formScroll = document.getElementById("formScroll");
          let formScrollRect = formScroll.getBoundingClientRect();
          if (this.rectContainsRect(formScrollRect, highlightRect)) {
            this.highlight(highlightRect);
            event.preventDefault();
            event.stopPropagation();
          }
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
  makeDraggable(editor) {
    if (editor.path == "root") {
      return;
    }

    editor.container.ondragstart = function (event) {
      var dt = event.dataTransfer;
      try {
        dt.setData(this.dataTransferType, editor.path);
      } catch (e) {
        this.dataTransferType = DATA_TRANSFER_TYPE_IE;
        dt.setData(this.dataTransferType, editor.path);
      }
    };

    editor.container.ondragend = function (event) {
      this.unHighlightSeparator();
    };
  }
  nearEdgeScroll(event) {
    const SCROLL_INCREMENT = 10;
    const NEAR_EDGE_DISTANCE = 25;
    const NEAR_EDGE_WAIT_TIME_MS = 1500;
    const edgeTopEnum = "top";
    const edgeBottomEnum = "bottom";

    let formScroll = document.getElementById("formScroll");
    let formScrollRect = formScroll.getBoundingClientRect();
    let now = (new Date()).getTime();

    if (event.clientY - formScrollRect.top <= NEAR_EDGE_DISTANCE) {
      if (!this.nearTopEdgeTime || (this.nearTopEdgeTime && formScroll.scrollTop == this.nearTopEdgeScrollTop)) {
        if (!this.nearTopEdgeTime) {
          this.nearTopEdgeTime = now;
          this.nearTopEdgeScrollTop = formScroll.scrollTop;
        }
        if ((now - this.nearTopEdgeTime) >= NEAR_EDGE_WAIT_TIME_MS) {
          // scroll up
          if ((formScroll.scrollTop - SCROLL_INCREMENT) < 0) {
            formScroll.scrollTop = 0;
          } else {
            formScroll.scrollTop -= SCROLL_INCREMENT;
          }
          this.nearTopEdgeScrollTop = formScroll.scrollTop;
        }
      } else {
        this.nearTopEdgeTime = 0;
        this.nearTopEdgeScrollTop = 0;
      }
    } else if (formScrollRect.bottom - event.clientY <= NEAR_EDGE_DISTANCE) {
      if (!this.nearBottomEdgeTime || (this.nearBottomEdgeTime && formScroll.scrollTop == this.nearBottomEdgeScrollTop)) {
        if (!this.nearBottomEdgeTime) {
          this.nearBottomEdgeTime = now;
          this.nearBottomEdgeScrollTop = formScroll.scrollTop;
        }
        if ((now - this.nearBottomEdgeTime) >= NEAR_EDGE_WAIT_TIME_MS) {
          // scroll down
          if (formScroll.scrollTop + SCROLL_INCREMENT > formScroll.scrollHeight) {
            formScroll.scrollTop = formScroll.scrollHeight;
          } else {
            formScroll.scrollTop += SCROLL_INCREMENT;
          }
          this.nearBottomEdgeScrollTop = formScroll.scrollTop;
        }
      } else {
        this.nearBottomEdgeTime = 0;
        this.nearBottomEdgeScrollTop = 0;
      }
    } else {
      this.nearTopEdgeTime = 0;
      this.nearTopEdgeScrollTop = 0;
      this.nearBottomEdgeTime = 0;
      this.nearBottomEdgeScrollTop = 0;
    }
  }
  addEditControl(editor,schema,path,container) {
    let edit = document.createElement("button");
    edit.classList.add("btn");    // can't use multiple arguments with IE browser
    edit.classList.add("btn-default");
    edit.classList.add("btn-xs");
    edit.innerHTML = "<span class='glyphicon glyphicon-edit' title='edit'></span>";
    edit.onclick = function (event) {
      console.log("edit",path);
      this.clickEditControl(editor);
    }.bind(this);
    if (schema.type == "string" || schema.type == "integer" || schema.type == "number" || schema.type == "boolean") {
      edit.style.marginLeft = "10px";
    }
    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn");
    deleteBtn.classList.add("btn-default");
    deleteBtn.classList.add("btn-xs");
    deleteBtn.innerHTML = "<span class='glyphicon glyphicon-remove' title='delete'></span>";
    deleteBtn.onclick = function (event) {
      this.clickDeleteControl(path);
    }.bind(this);
    let btnGroup = document.createElement("div");
    btnGroup.classList.add("btn-group");
    btnGroup.setAttribute("role","group");
    btnGroup.appendChild(edit);
    btnGroup.appendChild(deleteBtn);

    let header = this.getHeader(editor);
    header.appendChild(btnGroup);
  }
  getHeader(editor) {
    switch (editor.schema.type) {
      case "object":
      case "array":
        for (let child of editor.container.children) {
          if (child.tagName == "H3") {
            return child;
          }
        }
        break;
      case "string":
      case "integer":
      case "number":
      case "boolean":
        for (let child of editor.container.children) {
          for (let child2 of child.children) {
            if (child2.tagName == "LABEL") {
              return child2;
            }
          }
        }
        break;
    }
    return null;
  }
  clickEditControl(editor) {    
    let title = editor.schema.title;
    let pathArray = editor.path.split(".");
    let propertyName = pathArray.pop();
    let parentPath = pathArray.join(".");
    let parentEditor = this.editor.editors[parentPath];

    if (parentEditor.schema.type == "array") {
      title = title.match(/(.*) 1/)[1];
    }

    document.getElementById("editModalTitle").innerHTML = "Edit " + (title ? title : propertyName);
    document.getElementById("inputType").value = editor.schema.type;

    let inputTitle = document.getElementById("inputTitle");
    inputTitle.value = title ? title : "";
    inputTitle.oninput = function (event) {
      this.onTitleInput(editor);
    }.bind(this);

    if (parentEditor.schema.type == "object") {
      let inputPropertyName = document.getElementById("inputPropertyName");
      inputPropertyName.value = propertyName;
      inputPropertyName.onchange = function (event) {
        this.onPropertyNameChange();
      }.bind(this);
      this.originalPropertyName = propertyName;
      this.propertyNameChanged = false;
    } else {
      document.getElementById("inputPropertyNameFormGroup").style.display = "none";
    }
    document.getElementById("inputDescription").value = editor.schema.description ? editor.schema.description : "";
    document.getElementById("inputFormat").value = editor.schema.format ? editor.schema.format : "";

    validate.listenToFields(["inputPropertyName"], "editAccept");
    validate.addReturnPressListener(["inputTitle", "inputPropertyName", "inputDescription", "inputFormat"], function (event) {
      this.clickAcceptEdit(editor);
    }.bind(this));
    document.getElementById("editAccept").onclick = function (event) {
      this.clickAcceptEdit(editor);
    }.bind(this);

    $('#editModal').modal({
      keyboard: true,
      show: true
    });

    inputTitle.select();
  }
  onTitleInput(editor) {
    let title = document.getElementById("inputTitle").value.trim();

    document.getElementById("editModalTitle").innerHTML = "Edit " + title;

    let pathArray = editor.path.split(".");
    let propertyName = pathArray.pop();
    let parentPath = pathArray.join(".");
    let parentEditor = this.editor.editors[parentPath];
    if (parentEditor.schema.type == "object" && !this.propertyNameChanged) {
      document.getElementById("inputPropertyName").value = title.toLowerCase().replace(/ /g,"");
    }
  }
  onPropertyNameChange() {
    let propertyName = document.getElementById("inputPropertyName").value.trim();
    if (propertyName && propertyName != this.originalPropertyName) {
      this.propertyNameChanged = true;
    }
  }
  getEditValues() {
    return {
      title: document.getElementById("inputTitle").value,
      propertyName: document.getElementById("inputPropertyName").value,
      description: document.getElementById("inputDescription").value,
      format: document.getElementById("inputFormat").value
    };
  }
  clickAcceptEdit(editor) {
    let schema = this.getSchema(this.schema, editor.path);
    let values = this.getEditValues();
    schema.title = values.title;
    schema.description = values.description;
    schema.format = values.format;

    let pathArray = editor.path.split(".");
    let name = pathArray.pop();
    let parentPath = pathArray.join(".");
    let parentSchema = this.getSchema(this.schema, parentPath);
    if (parentSchema.type == "object") {
      delete parentSchema.properties[name];
      parentSchema.properties[values.propertyName] = schema;
    }

    $("#editModal").modal("hide");
    this.show();
  }
  clickDeleteControl(path) {
    let pathArray = path.split(".");
    let name = pathArray.pop();
    let parentPath = pathArray.join(".");
    let schema = this.getSchema(this.schema, parentPath);
    if (schema.type == "object") {
      delete schema.properties[name];
    } else if (schema.type == "array") {
      delete schema.items;
    }
    this.show();
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
  calculateHighlight(placement,parentRect,childRect) {
    let ret = {};
    ret.left = parentRect.left;
    ret.width = parentRect.width;

    switch (placement) {
      case placementInsideEnum:
        ret.top = parentRect.top;
        ret.height = parentRect.height;
        break;
      case placementAboveEnum:
        ret.height = 20;
        ret.top = childRect.top - 10;
        break;
      case placementBelowEnum:
        ret.height = 20;
        ret.top = childRect.bottom - 10;
        break;
    }
    ret.right = ret.left + ret.width;
    ret.bottom = ret.top + ret.height;
    ret.middleX = ret.left + (ret.right - ret.left) / 2;
    ret.middleY = ret.top + (ret.bottom - ret.top) / 2;
    return ret;
  }
  highlight(rect) {
    let sep = document.getElementById("separator");
    sep.style.backgroundColor = "rgba(128,128,128,0.5)";
    sep.style.position = "absolute";
    sep.style.left = rect.left + "px";
    sep.style.top = rect.top + "px";
    sep.style.width = rect.width + "px";
    sep.style.height = rect.height + "px";
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
    this.show();
  }
  scrollToAddedItem() {
    if (this.addedPath) {
      let control = this.editor.editors[this.addedPath].container;
      let controlRect = control.getBoundingClientRect();
      let formScroll = document.getElementById("formScroll");
      let formScrollRect = formScroll.getBoundingClientRect();
      // scroll into view;
      if (!this.rectContainsRect(formScrollRect, controlRect)) {
        if (controlRect.top < formScrollRect.top) {
          // scroll up
          formScroll.scrollTop -= formScrollRect.top - controlRect.top;
        } else if (controlRect.bottom > formScrollRect.bottom) {
          // scroll down
          formScroll.scrollTop += controlRect.bottom - formScrollRect.bottom;
        }
      }
      this.addedPath = "";
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
  scrollAndAdjustHightlight(highlightRect) {
    let formScrollRect = document.getElementById("formScroll").getBoundingClientRect();
    return highlightRect;
  }
  isControlVisible(container) {
    return this.isElementInScrollArea(container, document.getElementById("formScroll"));
  }
  isElementInScrollArea(el, scrollArea) {
    let scrollRect = scrollArea.getBoundingClientRect();
    let rect = el.getBoundingClientRect();
    return rect.top >= scrollRect.top && rect.bottom <= scrollRect.bottom;
  }
  rectContainsRect(rect1,rect2) {
    return rect2.top >= rect1.top && rect2.bottom <= rect1.bottom;    
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
