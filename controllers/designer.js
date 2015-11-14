var Component = require("./component");
var Menu = require("./menu");
var designerTemplate = require("./designer.hbs");
import * as jsonSchema from "../model/jsonSchema";

class Designer extends Component {
	constructor(containerID) {
		super(containerID, "Grackle | Designer");
		this.global();
    this.schema = new jsonSchema.objectItem("Form");
	}
	render(callback) {
		let menu = new Menu("", false, false, true, true);
		menu.render(function (err, menuView) {
			var view = designerTemplate({theMenu:menuView});
			callback(null, view);
		});
	}
  afterLoad() {
    var form = document.getElementById("formTarget");
    var options = {
      theme: "bootstrap3",
      schema: this.schema.exportObject()
    };
    this.editor = new JSONEditor(form,options);
  }
	onDragStart(event, fieldName) {
  	var dt = event.dataTransfer;
  	dt.setData("text/field", fieldName);
	}

  onDragOver(event) {
 		if (event.dataTransfer.types[0] == "text/field") {
    	document.getElementById("dragpoint").innerHTML = "(" + event.clientX + "," + event.clientY + ")";
    	var target = document.getElementById("formTarget");
    	target.style.border = "1px solid blue";
    	event.preventDefault();
  	}
	}
	onDragLeave(event) {
  	if (event.dataTransfer.types[0] == "text/field") {
    	document.getElementById("dragpoint").innerHTML = "";
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
