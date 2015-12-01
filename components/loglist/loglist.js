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
	global.vm = new Vue({
		el: "#main",
		template: template,
		data: data,
		created: function () {
			this.sort();
		},
		methods: {
			clickAdd: function () {
				let log = {
					title: this.getNewTitle()
				};
				this.logList.push(log);
				this.sort();
				chronofeed.request("PUT","/api/log/",log).then(function (newLog) {
					log._id = newLog._id;
				}).catch(function (err) {
					$("#placeForAlert").addClass("alert alert-warning");
					$("#placeForAlert").html(err.message);
				});
			},
			clickEdit: function (index) {
				console.log("edit",index);
			},
			clickConfirmDelete: function (event,index) {
				if (event.ctrlKey) {
					return this.clickDelete(index);
				}

				document.getElementById("deleteHeader").innerHTML = "<strong>" + this.logList[index].title + "</strong>";
				document.getElementById("deleteButton").onclick = function () {
					global.vm.clickDelete(index);
				};
				$("#deleteModal").modal();
			},
			clickDelete: function (index) {
				let log = this.logList[index];
				this.logList.splice(index,1);
				chronofeed.request("DELETE","/api/log/" + log._id + "/").catch(function (err) {
					$("#placeForAlert").addClass("alert alert-warning");
					$("#placeForAlert").html(err.message);
				});
			},
			hasTitle: function (title) {
			  for (let log of this.logList) {
			    if (log.title == title)
			      return true;
			  }
			  return false;
			},
			getNewTitle: function () {
			  var title;
			  for (var i = 1; true; i++) {
			    if (i == 1) {
			      title = "New Log";
			    } else {
			      title = "New Log " + i.toString();
			    }
			    if (!this.hasTitle(title)) {
			      return title;
			    }
			  }
			},
			sort: function () {
			  this.logList.sort(function (a,b) {
			    if (a.title < b.title)
			      return -1;
			    if (a.title > b.title)
			      return 1;
			    return 0;
			  });
			}
		}
	});
});

