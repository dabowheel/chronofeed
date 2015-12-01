"use strict";
let template = require("./loglist.template.html");

new Vue({
	el: "#main",
	template: template,
	data: {
		logList: [
			{
				title: "my title",
				domID: "1"
			}
		]
	}
});
