let Component = require("./component");
let Vue = require("../node_modules/vue/dist/vue");
let view = require("./loglist.html");

class LogList extends Component {
	constructor(containerID) {
		super(containerID);
		this.data = {
			message: "Hello Vue!"
		};
	}
	render(callback) {
		callback(null, view);
	}
	afterLoad() {
		this.mv = new Vue({
			el: "#main",
			data: this.data
		});
	}
}

module.exports = LogList;
