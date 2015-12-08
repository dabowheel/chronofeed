<style>
  html,body {
  	height: 100%;
  	margin: 0;
  }

	.gr-form-control {
	  height: 33px;
	  display: inline;
	  width: auto;
	}

	.gr-blog-title {
	  font-weight: bold;
	}

	.gr-row-buttons {
	  float: right;
	}

	.gr-datetime {
	  width: auto;
	  display: inline;
	}

	.gr-hotkey:first-letter {
	  text-decoration: underline;
	}

	.gr-forgot-password-link {
	  position: relative;
	  top: -11px;
	}

	.gr-alert {
	  float: none;
	}


	/* Profile View */
	.gr-not-verified {
	  color: orange;
	}
	.gr-verified {
	  color: green;
	}

	.gr-vertical-space {
	  height: 10px;
	}

	.gr-verify-email {
	  position: relative;
	  top: -5px;
	}

	.gr-datetime-btn {
	  width: auto;
	}

	.gr-input-group {
	  width: 100%;
	}

	@media (min-width: 500px) {
	  .gr-input-group {
	    width: auto;
	  }
	  .gr-form-group {
	    width: auto;
	  }
	  .gr-input-group-addon {
	    width: auto;
	  }
	}

	/* Designer */
	.gr-designer-form {
	  width: 100%;
	  height: 100%;
	}

	.gr-fill-container {
	  height: 100%;
	}
	.gr-fill-parent {
	  display: flex;
	  flex-flow: column;
	  height: 100%;
	}
	.gr-fill {
	  flex: 1 1 auto;
	}

	/* designer toolbox */
	.gr-toolbox {
	}

	.gr-designer-footer {
	  position: absolute;
	  left: 0px;
	  top: 0px;
	}

	.gr-designer-form {
	}

	#formTarget {
	}

	#formScroll {
	  border-top: 1px solid #ddd;
	  border-bottom: 1px solid #ddd;
	}

	.gr-scroll-y {
	  overflow-y:auto;
	}

	#formTarget .row {
	  margin-left: 0px;
	  margin-right: 0px;
	}

	#formTarget input {
	  cursor: default;
	}

	.gr-toolbox {
	  display: flex;
	}

	.gr-toolbox-control {
	  margin-top: 10px;
	  margin-left: 10px;
	  margin-right: 10px;
	  margin-bottom: -7px;
	  max-width: 150px;
	}

	.gr-toolbox-label {
	  text-align: center;
	}

	.gr-toolbox-control > input,textarea {
	  cursor: default !important;
	}

	.gr-toolbox-control > div > input[type=checkbox] {
	  cursor: default !important;
	}

	.gr-textarea-field {
	  resize: none;
	}

	#schemaText {
	  width: 100%;
	  padding-left: 0px;
	  padding-right: 0px;
	  resize: none;
	  font-family: Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New, monospace;  
	}

	.gr-toolbox-text-center {
	  text-align: center;
	}

	.gr-toolbox-font-large {
	  font-size: 50px;
	}

	.gr-toolbox-boolean-cover {
	  width: 100%;
	  height: 40px;
	  position: relative;
	  top: -40px;
	  background-color: rgba(0,0,0,0.0);
	}

	.gr-schema-text {
	  width: 100%;
	  font-family: Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New, monospace;
	}

	.gr-no-margin-bottom {
	  margin-bottom: 0px;
	}

	.gr-alert {
	  margin-bottom: 0px;
	}

	.gr-designer-separator {
	  pointer-events: none;
	}

	.gr-margin-bottom-15px {
	  margin-bottom: 15px;
	}

	.gr-margin-top-15px {
	  margin-top: 15px;
	}

	#designerButtons {
	  float: right;
	  margin-top: 10px;
	  margin-bottom: 10px;
	}

</style>

<template>

	<div v-if="err" class="container">
	  <div class="row">
		  <div class="col-md-6 col-lg-6">
				<div class="alert alert-warning">{{err}}</div>
			</div>
		</div>
	</div>

	<div v-if="info" class="container">
	  <div class="row">
		  <div class="col-md-6 col-lg-6">
				<div class="alert alert-info">{{info}}</div>
			</div>
		</div>
	</div>

	<div class="container">
		<ul class="nav nav-tabs">
			<li role="presentation" v-bind:class="{'active': tab == 'visual'}">
				<a href="#visual" onclick="return false;" v-on:click="clickVisualTab();">Visual</a>
			</li>
			<li role="presentation" v-bind:class="{'active': tab == 'schema'}">
				<a href="#schema" onclick="return false;" v-on:click="clickSchemaTab();">Schema</a>
			</li>
		</ul>
	</div>

	<div class="modal" tabindex="-1" id="editModal">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title" id="editModalTitle">Modal title</h4>
	      </div>

	      <div class="modal-body" id="editModalBody">

	      	<div class="form-group">
	      		<label for="inputType">Type</label>
	      		<input type="text" class="form-control" id="inputType" disabled />
	      	</div>

	        <div class="form-group">
	        	<label for="inputTitle">Title</label>
	        	<input type="text" class="form-control" id="inputTitle" />
	        </div>

	        <div class="form-group" id="inputPropertyNameFormGroup">
		        <label for="inputPropertyName">Property Name</label>
		        <input type="text" class="form-control" id="inputPropertyName" required />
	        </div>

	        <div class="form-group">
	        	<label for="inputDescription">Description</label>
	        	<input type="text" class="form-control" id="inputDescription" />
	        </div>

	        <div class="form-group">
	        	<label for="inputFormat">Format</label>
	        	<input type="text" class="form-control" id="inputFormat" />
	        </div>

	        <div class="form-group" id="inputEnumFormGroup">
	          <label for="inputEnum">Enum</label>
	          <div class="input-group">
	            <input type="text" class="form-control" placeholder="Enum value" id="inputEnum" />
	            <span class="input-group-btn">
	              <button class="btn btn-default" type="button" v-on:click="clickAddEnum();">Add</button>
	            </span>
	          </div>
	          <div id="enumTable"></div>
	        </div>

	        <div class="form-group">
	          <label for="inputDefault">Default</label>
	          <input type="text" class="form-control" id="inputDefault" />
	        </div>

	        <div id="editModalPlaceForAlert">
	        </div>

	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-primary gr-hotkey" id="editAccept" accesskey="a">Accept</button>
	        <button type="button" class="btn btn-default gr-hotkey" data-dismiss="modal" accesskey="c">Cancel</button>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->

	<div v-if="tab == 'visual'" class="container">
		<div class="gr-toolbox">

			<div class="gr-toolbox-control" draggable="true" v-on:dragstart="onDragStart($event,'string');" v-on:dragend="onDragEnd($event);">
				<div class="gr-toolbox-label"><label>String</label></div>
				<input type="text" class="form-control" disabled />
			</div>

			<div class="gr-toolbox-control" draggable="true" v-on:dragstart="onDragStart($event,'integer');" v-on:dragend="onDragEnd($event);">
				<div class="gr-toolbox-label"><label>Integer</label></div>
				<input type="number" class="form-control" disabled />
			</div>

			<div class="gr-toolbox-control" draggable="true" v-on:dragstart="onDragStart($event,'number');" v-on:dragend="onDragEnd($event);">
				<div class="gr-toolbox-label"><label>Number</label></div>
				<input type="number" class="form-control" disabled />
			</div>

			<div class="gr-toolbox-control" draggable="true" v-on:dragstart="onDragStart($event,'boolean');" v-on:dragend="onDragEnd($event);">
				<div class="gr-toolbox-label"><label>Boolean</label></div>
				<select class="form-control" disabled>
					<option value="undefined"></option>
					<option value="1">true</option>
					<option value="0">false</option>
				</select>
				<div class="gr-toolbox-boolean-cover">
				</div>
			</div>

			<div class="gr-toolbox-control" draggable="true" v-on:dragstart="onDragStart($event,'array');" v-on:dragend="onDragEnd($event);">
				<div class="gr-toolbox-label"><label>Array</label></div>
				<div class="gr-toolbox-text-center"><span class="glyphicon glyphicon-list gr-toolbox-font-large"></span></div>
			</div>

			<div class="gr-toolbox-control" draggable="true" v-on:dragstart="onDragStart($event,'object');" v-on:dragend="onDragEnd($event);">
				<div class="gr-toolbox-label"><label>Object</label></div>
				<div class="gr-toolbox-text-center"><span class="fa fa-codepen gr-toolbox-font-large"></span></div>
			</div>

		</div>
	</div>

	<div v-if="tab == 'visual'" class="container gr-fill gr-scroll-y" id="formScroll">
		<div id="formTarget">
		</div>

		<div class="gr-designer-separator" id="separator">
		</div>

	</div>

	<div v-if="tab == 'visual'" class="container">
		<div id="designerButtons">
			<button class="btn btn-primary" v-on:click="saveSchema">Save</button>
			<button class="btn btn-default" v-on:click="cancelSchemaChange">Cancel</button>
		</div>
	</div>

	<div v-if="tab == 'schema'" class="container gr-fill">
		<textarea rows="10" cols="80" id="schemaText" v-model="schemaText"></textarea>
	</div>

</template>

<script>
	const visualTabEnum = "visual";
	const schemaTabEnum = "schema";
	const placementNoneEnum = "";
	const placementBeforeEnum = "before";
	const placementAfterEnum = "after";
	const placementInsideEnum = "inside";
	const DATA_TRANSFER_TYPE_DEFAULT = "text/plain";
	const DATA_TRANSFER_TYPE_IE = "Text";

	export default {
		data: function () {
			let m = location.pathname.match(/^\/log\/(.*)\/designer\/$/);
			if (!m) {
				throw new Error("invalid path " + location.pathname);
			}
			let title = decodeURI(m[1]);
			return {
				title: title,
				log: null,
				logList: null,
				schema: null,
				tab: visualTabEnum,
				dataTransferType: DATA_TRANSFER_TYPE_DEFAULT,
				scrollTop: 0,
				addedPath: "",
				objectNames: {},
				nearTopEdgeTime: 0,
				nearBottomEdgeTime: 0,
				dragData: "",
				enableDebug: false,
				editEnumList: [],
				editor: null,
				schemaText: "",
				err: "",
				info: ""
			};
		},
		created: function () {
	    this.extendEditorTheme();
	    document.title = this.title + " Designer | Chronofeed";
		},
		asyncData: function () {
			let self = this;
			return chronofeed.request("GET", "/api/log/", null).then(function (result) {
				let logList = result.list;
				let log = null;
				for (let l of logList) {
					if (l.title == self.title) {
						log = l;
						break;
					}
				}
				if (!log) {
					throw new Error("could not find log");
				}
				return {
					logList: logList,
					log: log
				};
			});
		},
		events: {
			"async-data": function () {
				if (this.log) {
					this.schema = this.log.schema;
					if (!this.schema) {
						this.schema = {
							type: "object",
							title: "Entry"
						};
					}
					this.schemaText = JSON.stringify(this.schema, null, 2);
					this.createJSONEditor();
				}
			}
		},
		methods: {
		  createJSONEditor() {
		    if (this.tab == visualTabEnum) {
		    	let formScroll = document.getElementById("formScroll");
		    	this.scrollTop = formScroll.scrollTop;
		      var form = document.getElementById("formTarget");
		      while (form.firstChild) {
		      	form.removeChild(form.firstChild);
		      }
		      var options = {
		        theme: "chronofeed",
		        schema: this.schema,
		        startval: this.getInitialValue(this.schema),
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
		      	this.err = err.message ? err.message : err;
		      }
		      if (this.editor) {
		        this.addControlListeners(this.editor.root);
		        formScroll.scrollTop = this.scrollTop;
		        this.scrollToAddedItem();
		      }
		    } else if (this.tab == schemaTabEnum) {
		      this.schemaText = JSON.stringify(this.schema, null, 2);
		    }
		  },
		  extendEditorTheme() {
		    JSONEditor.defaults.themes.chronofeed = JSONEditor.defaults.themes.bootstrap3.extend({
		      getTextareaInput: function () {
		        let el = this._super();
		        el.style.height = "300px";
		        el.style.resize = "none";
		        el.ondragover = designerVM.disableDrop;
		        el.ondragenter = designerVM.disableDrop;
		        return el;
		      },
		      getFormInputField(type) {
		        let el = this._super(type);
		        el.ondragover = designerVM.disableDrop;
		        el.ondragenter = designerVM.disableDrop;
		        return el;
		      }
		    });
		  },
		  clickVisualTab() {
		    try {
		      this.schema = JSON.parse(this.schemaText);
		    }
		    catch (err) {
		    	this.err = err.message;
		    }
		    this.tab = visualTabEnum;
		    Vue.nextTick(function () {
			    this.createJSONEditor();
			  }.bind(this));
		  },
		  clickSchemaTab() {
		  	this.schemaText = JSON.stringify(this.schema, null, 2);
		    this.tab = schemaTabEnum;
		    Vue.nextTick(function () {
			    this.resizeSchemaText();
			  }.bind(this));
		  },
		  resizeSchemaText() {
		    let el = document.getElementById("schemaText");
		    let rect = el.getBoundingClientRect();
		    el.style.height = el.parentElement.offsetHeight - 6 + "px";
		  },
		  getInitialValue(schema) {
		    switch (schema.type) {
		      case "string":
		        if (schema.default) {
		          return schema.default;
		        }
		        return "";
		      case "integer":
		        if (schema.default) {
		          return schema.default;
		        }
		        return 0;
		      case "number":
		        if (schema.default) {
		          return schema.default;
		        }
		        return 0;
		      case "boolean":
		        if (schema.default) {
		          return schema.default;
		        }
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
		  },
			onDragStart(event, fieldName) {
		  	var dt = event.dataTransfer;
		    try {
		    	dt.setData(this.dataTransferType, fieldName);
		    } catch (e) {
		      this.dataTransferType = DATA_TRANSFER_TYPE_IE;
		      dt.setData(this.dataTransferType, fieldName);
		    }
		    this.dragData = fieldName;
			},
		  onDragEnd(event) {
		    this.unHighlightSeparator();
		    this.dragData = "";
		  },
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
		      	this.debug("ondragover " + event.dataTransfer.types + " " + this.dataTransferType);
		        if (event.dataTransfer.types[0] == this.dataTransferType) {
		          this.nearEdgeScroll(event);

		          let {placement, child} = this.calculatePlacement(editor,event);
		          if (!this.isItemType(this.dragData) && !this.isDragPath(this.dragData, editor, placement, child)) {
		            return;
		          }
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
		          let data = event.dataTransfer.getData(this.dataTransferType);
		          let {placement, child} = this.calculatePlacement(editor, event);
		          if (this.isItemType(data)) {
		            let itemSchema = {
		              type: data
		            };
		            let propertyName = this.getNewPropertyName(itemSchema.type);
		            this.addItem(itemSchema, propertyName, editor, placement, child);
		          } else if (this.isDragPath(data, editor, placement, child)) {
		            this.moveItem(data, editor, placement, child);
		          } else {
		            return;
		          }
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
		  },
		  disableDrop(event) {
		    event.dataTransfer.dropEffect = "none";
		    event.preventDefault();
		    event.stopPropagation();
		    return false;
		  },
		  makeDraggable(editor) {
		    if (editor.path == "root") {
		      return;
		    }

		    editor.container.setAttribute("draggable",true);
		    editor.container.ondragstart = function (event) {
		      var dt = event.dataTransfer;
		      try {
		        dt.setData(this.dataTransferType, editor.path);
		      } catch (e) {
		        this.dataTransferType = DATA_TRANSFER_TYPE_IE;
		        dt.setData(this.dataTransferType, editor.path);
		      }
		      this.dragData = editor.path;
		      event.stopPropagation();
		    }.bind(this);

		    editor.container.ondragend = function (event) {
		      this.dragData = "";
		      this.unHighlightSeparator();
		    }.bind(this);
		  },
		  isItemType(type) {
		    switch(type) {
		      case "string":
		      case "integer":
		      case "number":
		      case "boolean":
		      case "array":
		      case "object":
		      	this.debug("valid type " + type);
		        return true;
		    }
		    this.debug("invalid type " + type);
		    return false;
		  },
		  debug(message) {
		    if (this.enableDebug) {
		    	this.info = message;
		    }
		  },
		  isDragPath(sourcePath,destEditor,placement,child) {
		    // check if a valid path
		    if (!this.editor.editors[sourcePath]) {
		      this.debug("not a valid path: " + sourcePath);
		      return false;
		    }

		    // source should not move to decendant of source
		    if (this.pathContainsPath(destEditor.path, sourcePath)) {
		      this.debug("dest path " + destEditor.path + " contains source path " + sourcePath);
		      return false;
		    }

		    if (child) {
		      // source should not move to before or after source
		      if (sourcePath == child.path) {
		        this.debug("sourcePath " + sourcePath + " equals child.path " + child.path);
		        return false;
		      }

		      // should not place after previous sibling or before next sibling
		      let [parentPath,name] = this.pathPop(sourcePath);
		      if ((parentPath == destEditor.path)) {
		        let [prev,next] = this.getSiblings(destEditor, name);
		        if (child.path == prev && placement == placementAfterEnum) {
		          this.debug("child path " + child.path + " after");
		          return false;
		        }
		        if (child.path == next && placement == placementBeforeEnum) {
		          this.debug("child path " + child.path + " before");
		          return false;
		        }
		      }
		    }

		    this.debug("good move");
		    return true;
		  },
		  pathContainsPath(path1,path2) {
		    let pathArray1 = path1.split(".");
		    let pathArray2 = path2.split(".");
		    for (let i in pathArray2) {
		      if (pathArray2[i] != pathArray1[i]) {
		        return false;
		      }
		    }
		    return true;
		  },
		  pathPop(path) {
		    let pathArray = path.split(".");
		    let name = pathArray.pop();
		    return [pathArray.join("."), name];
		  },
		  getSiblings(editor,name) {
		    let prev = "";
		    let next = "";
		    for (let i = 0; i < editor.property_order.length; i++) {
		      if (editor.property_order[i] == name) {
		        if (editor.property_order[i-1]) {
		          prev = editor.path + "." + editor.property_order[i-1];
		        }
		        if (editor.property_order[i+1]) {
		          next = editor.path + "." + editor.property_order[i+1];
		        }
		        return [prev, next];
		      }
		    }
		    return [prev, next];
		  },
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
		  },
		  addEditControl(editor,schema,path,container) {
		    let edit = document.createElement("button");
		    edit.classList.add("btn");    // can't use multiple arguments with IE browser
		    edit.classList.add("btn-default");
		    edit.classList.add("btn-xs");
		    edit.innerHTML = "<span class='glyphicon glyphicon-edit' title='edit'></span>";
		    edit.onclick = function (event) {
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
		  },
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
		  },
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
		      document.getElementById("inputPropertyNameFormGroup").style.display = "";
		    } else {
		      document.getElementById("inputPropertyNameFormGroup").style.display = "none";
		    }
		    document.getElementById("inputDescription").value = editor.schema.description ? editor.schema.description : "";
		    document.getElementById("inputFormat").value = editor.schema.format ? editor.schema.format : "";

		    // enum
		    if (editor.schema.type == "string") {
		      document.getElementById("inputEnumFormGroup").style.display = "";
		      this.editEnumList = editor.schema.enum;
		      if (!this.editEnumList || !this.editEnumList.push) {
		        this.editEnumList = [];
		      }
		      this.setEnumTable();
		      chronofeed.triggerOnEnter(["inputEnum"], function () {
		        this.clickAddEnum();
		      }.bind(this));
		    } else {
		      document.getElementById("inputEnumFormGroup").style.display="none";
		    }

		    // default
		    switch (editor.schema.type) {
		      case "string":
		      case "boolean":
		      case "number":
		      case "integer":
		        let inputDefault = document.getElementById("inputDefault");
		        inputDefault.value = editor.schema.default ? editor.schema.default : "";
		        inputDefault.style.display = "";
		        break;
		      default:
		        document.getElementById("inputDefault").style.display = "none";
		        break;
		    }

		    chronofeed.requireFields(["inputPropertyName"], "editAccept");
		    chronofeed.triggerOnEnter(["inputTitle", "inputPropertyName", "inputDescription", "inputFormat", "inputDefault"], function (event) {
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
		  },
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
		  },
		  onPropertyNameChange() {
		    let propertyName = document.getElementById("inputPropertyName").value.trim();
		    if (propertyName && propertyName != this.originalPropertyName) {
		      this.propertyNameChanged = true;
		    }
		  },
		  clickAddEnum() {
		    let inputEnum = document.getElementById("inputEnum");
		    let value = inputEnum.value;
		    if (value) {
		      this.editEnumList.push(value);
		      this.setEnumTable();
		      inputEnum.value = "";
		    }
		  },
		  setEnumTable() {
		    let enumTable = document.getElementById("enumTable");
		    while(enumTable.firstChild) {
		      enumTable.removeChild(enumTable.firstChild);
		    }
		    enumTable.appendChild(this.createEnumTable());    
		  },
		  createEnumTable() {
		    let table = document.createElement("table");
		    table.classList.add("table");
		    table.classList.add("table-bordered");
		    table.classList.add("table-hover");
		    let tbody = document.createElement("tbody");
		    for (let i in this.editEnumList) {
		      let value = this.editEnumList[i];
		      let tr = document.createElement("tr");
		      let td = document.createElement("td");
		      td.innerHTML = value;
		      let deleteBtn = document.createElement("button");
		      deleteBtn.classList.add("btn");
		      deleteBtn.classList.add("btn-default");
		      deleteBtn.classList.add("btn-xs");
		      deleteBtn.classList.add("gr-row-buttons");
		      deleteBtn.setAttribute("type","button");
		      deleteBtn.setAttribute("title","delete");
		      deleteBtn.onclick = function () {
		        this.clickDeleteEnum(i);
		      }.bind(this);
		      let icon = document.createElement("span");
		      icon.classList.add("glyphicon");
		      icon.classList.add("glyphicon-remove");
		      deleteBtn.appendChild(icon);
		      td.appendChild(deleteBtn);
		      tr.appendChild(td);
		      tbody.appendChild(tr);
		    }
		    table.appendChild(tbody);
		    return table;
		  },
		  clickDeleteEnum(i) {
		    this.editEnumList.splice(i,1);
		    this.setEnumTable();
		  },
		  getEditValues() {
		    return {
		      title: document.getElementById("inputTitle").value,
		      propertyName: document.getElementById("inputPropertyName").value,
		      description: document.getElementById("inputDescription").value,
		      format: document.getElementById("inputFormat").value,
		      default: document.getElementById("inputDefault").value
		    };
		  },
		  editModalValidate(values,path,schema) {
		    let [parentPath, propertyName] = this.pathPop(path);
		    let parentSchema = this.getSchema(this.schema, parentPath);

		    if (parentSchema.type == "object") {
		      if (values.propertyName != propertyName) {
		        if (parentSchema.properties.hasOwnProperty(values.propertyName)) {
		          $("#editModalPlaceForAlert").addClass("alert alert-danger");
		          $("#editModalPlaceForAlert").html("Another item with this property name already exists.");
		          return false;
		        }
		      }
		    }
		    return true;
		  },
		  clickAcceptEdit(editor) {
		    let schema = this.getSchema(this.schema, editor.path);
		    let values = this.getEditValues();

		    if (!this.editModalValidate(values, editor.path, schema)) {
		      return;
		    }

		    if (values.title) {
		      schema.title = values.title;
		    }

		    if (values.description) {
		      schema.description = values.description;
		    }

		    if (values.format) {
		      schema.format = values.format;
		    }

		    if (schema.type == "string") {
		      if (this.editEnumList.length) {
		        schema.enum = this.editEnumList;
		      }
		    }

		    if (values.default) {
		      switch (schema.type) {
		        case "string":
		        case "integer":
		        case "number":
		        case "boolean":
		          schema.default = values.default;
		          break;
		      }
		    }

		    let pathArray = editor.path.split(".");
		    let name = pathArray.pop();
		    let parentPath = pathArray.join(".");
		    let parentSchema = this.getSchema(this.schema, parentPath);
		    if (parentSchema.type == "object") {
		      delete parentSchema.properties[name];
		      parentSchema.properties[values.propertyName] = schema;
		    }

		    $("#editModal").modal("hide");
		    this.createJSONEditor();
		  },
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
		    this.createJSONEditor();
		  },
		  // gives an area in container where the use can drop an item
		  addBottomDropTarget(container) {
		    let t = document.createElement("div");
		    t.style.height = "10px";
		    container.appendChild(t);
		  },
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
		        placement = placementBeforeEnum;
		      } else {
		        placement = placementAfterEnum;
		      }
		    }

		    return {
		      placement: placement,
		      child: child
		    };
		  },
		  inContainer(event,container) {
		    let rect = container.getBoundingClientRect();
		    if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) {
		      return true;
		    } else {
		      return false;
		    }
		  },
		  getDistance(event,container) {
		    // middle of container
		    let rect = container.getBoundingClientRect();
		    let containerX = (rect.right - rect.left) / 2 + rect.left;
		    let containerY = (rect.bottom - rect.top) / 2 + rect.top;
		    return Math.sqrt(Math.pow(event.clientX - containerX, 2) + Math.pow(event.clientY - containerY, 2));
		  },
		  calculateHighlight(placement,parentRect,childRect) {
		    let ret = {};
		    ret.left = parentRect.left;
		    ret.width = parentRect.width;

		    switch (placement) {
		      case placementInsideEnum:
		        ret.top = parentRect.top;
		        ret.height = parentRect.height;
		        break;
		      case placementBeforeEnum:
		        ret.height = 20;
		        ret.top = childRect.top - 10;
		        break;
		      case placementAfterEnum:
		        ret.height = 20;
		        ret.top = childRect.bottom - 10;
		        break;
		    }
		    ret.right = ret.left + ret.width;
		    ret.bottom = ret.top + ret.height;
		    ret.middleX = ret.left + (ret.right - ret.left) / 2;
		    ret.middleY = ret.top + (ret.bottom - ret.top) / 2;
		    return ret;
		  },
		  highlight(rect) {
		    let sep = document.getElementById("separator");
		    sep.style.backgroundColor = "rgba(128,128,128,0.5)";
		    sep.style.position = "absolute";
		    sep.style.left = rect.left + "px";
		    sep.style.top = rect.top + "px";
		    sep.style.width = rect.width + "px";
		    sep.style.height = rect.height + "px";
		  },
		  unHighlightSeparator() {
		    let sep = document.getElementById("separator");
		    sep.style.height = "";
		    sep.style.width = "";
		    sep.style.backgroundColor = "";
		    sep.style.position = "";
		    sep.style.left = "";
		    sep.style.top = "";
		  },
		  addItem(itemSchema,propertyName,destEditor,placement,child) {
		    let parentSchema = this.getSchema(this.schema, destEditor.path);
		    if (parentSchema.type == "object") {
		      if (parentSchema.properties && parentSchema.properties.hasOwnProperty(propertyName)) {
		        propertyName = this.getNewPropertyName(itemSchema.type);
		      }
		      this.addedPath = destEditor.path + "." + propertyName;
		      if (!parentSchema.properties) {
		        parentSchema.properties = {};
		      }
		      parentSchema.properties[propertyName] = itemSchema;
		      if (child) {
		        let childOrder = destEditor.property_order.length;
		        for (let i = 0; i < destEditor.property_order.length; i++) {
		          if (destEditor.property_order[i] == child.key) {
		            childOrder = i;
		            break;
		          }
		        }
		        let new_property_order = destEditor.property_order.splice(0);
		        if (placement == placementBeforeEnum) {
		          new_property_order.splice(childOrder, 0, propertyName);
		        } else {
		          new_property_order.splice(childOrder+1, 0, propertyName);
		        }
		        for (let i = 0; i < new_property_order.length; i++) {
		          parentSchema.properties[new_property_order[i]].propertyOrder = i;
		        }
		      }
		    } else if (parentSchema.type == "array") {
		      parentSchema.items = itemSchema;
		      this.addedPath = destEditor.path + ".0";
		    }
		    this.createJSONEditor();
		  },
		  moveItem(sourcePath,destEditor,placement,child) {
		    let [parentPath,propertyName] = this.pathPop(sourcePath);
		    let parentEditor = this.editor.editors[parentPath];
		    let parentSchema = this.getSchema(this.schema, parentPath);
		    let itemSchema = this.deleteItem(parentEditor, parentSchema, propertyName);
		    if (parentSchema.type == "array" && destEditor.schema.type == "object") {
		      propertyName = this.getNewPropertyName(itemSchema.type);
		    }
		    this.addItem(itemSchema, propertyName, destEditor, placement, child);
		    this.createJSONEditor();
		  },
		  deleteItem(parentEditor,parentSchema,propertyName) {
		    let ret = null;
		    if (parentSchema.type == "object") {
		      ret = parentSchema.properties[propertyName];
		      delete parentSchema.properties[propertyName];
		      for (let i = 0; i < parentEditor.property_order.length; i++) {
		        if (parentEditor.property_order[i] == propertyName) {
		          parentEditor.property_order.splice(i,1);
		          break;
		        }
		      }
		    } else if (parentSchema.type == "array") {
		      ret = parentSchema.items;
		      delete parentSchema.items;
		    }
		    return ret;
		  },
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
		  },
		  isElementInViewport (el) {
		    var rect = el.getBoundingClientRect();

		    return (
		      rect.top >= 0 &&
		      rect.left >= 0 &&
		      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
		      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
		    );
		  },
		  scrollAndAdjustHightlight(highlightRect) {
		    let formScrollRect = document.getElementById("formScroll").getBoundingClientRect();
		    return highlightRect;
		  },
		  isControlVisible(container) {
		    return this.isElementInScrollArea(container, document.getElementById("formScroll"));
		  },
		  isElementInScrollArea(el, scrollArea) {
		    let scrollRect = scrollArea.getBoundingClientRect();
		    let rect = el.getBoundingClientRect();
		    return rect.top >= scrollRect.top && rect.bottom <= scrollRect.bottom;
		  },
		  rectContainsRect(rect1,rect2) {
		    return rect2.top >= rect1.top && rect2.bottom <= rect1.bottom;    
		  },
		  getNewPropertyName(type) {
		    for (let i = 1; ; i ++) {
		      let name = type + i;
		      if (!this.objectNames.hasOwnProperty(name)) {
		        return name;
		      }
		    }
		  },
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
		  },
		  getObjectNames(schema) {
		    for (let name in schema.properties) {
		      this.objectNames[name] = true;
		    }
		  },
		 	saveSchema() {
		 		this.log.schema = this.schema;
		 		chronofeed.request("POST", "/api/log/" + this.log._id + "/", this.log).then(function () {
		 			location.assign("/log/" + encodeURI(this.title) + "/");
		 		}.bind(this)).catch(function (err) {
		 			this.err = err.message ? err.message : err;
		 		}.bind(this));
		 	},
		 	cancelSchemaChange() {
		 		location.assign("/log/" + encodeURI(this.title) + "/");
		 	}
		}
	};
</script>