<template>
	<div class="container">
	  <div class="row">
	    <div v-if="err" class="col-md-8 col-lg-8 alert alert-warning" id="placeForAlert">{{err}}</div>
	  </div>
	  <div class="row">
	    <div class="col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12">
	      <button class="btn btn-primary" v-on:click="clickAdd();">Add Log</button>
	      <table class="table table-hover">
	        <tbody v-for="log in logList">
	          <tr>
	            <td>
	              <div class="btn-group" role="group">
	                <button class="btn btn-default btn-xs" v-on:click="clickEdit($index);" title="edit">
	                  <span class="glyphicon glyphicon-pencil"></span>
	                </button>
	                <button class="btn btn-default btn-xs" v-on:click="clickConfirmDelete($event,$index)" title="delete">
	                  <span class="glyphicon glyphicon-remove"></span>
	                </button>
	              </div>
	              <strong>{{log.title}}</strong>
	            </td>
	          </tr>
	        </tbody>
	      </table>
	    </div>
	  </div>
	</div>

	<div class="modal fade" id="deleteModal" tabindex="-1">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header" id="deleteHeader"></div>
	      <div class="modal-body">
	        Are you sure that you want to delete the log?
	      </div>
	      <div class="modal-footer">
	        <button class="btn btn-default" data-dismiss="modal">Don't Delete</button>
	        <button class="btn btn-primary" data-dismiss="modal" id="deleteButton">Delete</button>
	      </div>
	    </div>
	  </div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				logList: [],
				err: ""
			};
		},
		asyncData: function () {
			return chronofeed.request("GET","/api/log/", null).then(function (result) {
				return Promise.resolve({
					logList: result.list,
				}).catch(function (err) {
					return Promise.resolve({
						err: err.message ? err.message : err
					});
				});
			});
		},
		created: function () {
			this.sort();
		},
		events: {
			"async-data": function () {
				this.sort();
			}
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
					this.clickDelete(index);
				}.bind(this);
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
	};
</script>
