"use strict";
let template = require("./loglist.template.html");

let p;
let data;
if (chronofeed.store.logList) {
	p = Promise.resolve({
		logList: chronofeed.store.logList
	});
} else {
	p = chronofeed.request("GET","/api/log/", null).then(function (result) {
		chronofeed.store.logList = result.list;
		return Promise.resolve({
			logList: chronofeed.store.logList,
		});
	}).catch(function (err) {
		return Promise.resolve({
			err: err.message ? err.message : err
		});
	});
}

p.then(function (data) {
	new Vue({
		el: "#main",
		template: template,
		data: data,
		methods: {
			clickAdd: function () {
				console.log("add");
			},
			clickEdit: function (index) {
				console.log("edit",index);
			},
			clickConfirmDelete: function (index) {
				console.log("delete",index);
			}
		}
	});
});
