<style>
	.cf-form-control {
	  height: 33px;
	  display: inline;
	  width: auto;
	}
	.cf-hotkey:first-letter {
	  text-decoration: underline;
	}
	.cf-log-title {
	  font-weight: bold;
	}

	.cf-input-group {
	  width: 100%;
	}

	@media (min-width: 500px) {
	  .cf-input-group {
	    width: auto;
	  }
	  .cf-form-group {
	    width: auto;
	  }
	  .cf-input-group-addon {
	    width: auto;
	  }
	}

	.cf-row-buttons {
	  float: right;
	}

</style>

<template>
	<div class="container">
		<menu islog="true" v-bind:logtitle="title"></menu>

	  <div v-if="err" class="col-md-6 col-lg-6 alert alert-warning" id="placeForAlert">{{err.message ? err.message : err}}</div>

	  <div v-if="editTitle" class="row">
	    <div class="col-md-6 col-lg-6">
	      <div class="form-group" id="inputTitleFormGroup">
	        <input class="form-control cf-form-control" id="inputTitle" type="text" v-model="title" />
	        <button class="btn btn-primary cf-hotkey" v-on:click="saveTitleChange();" accesskey="a" id="blogTitleAcceptButton">Accept</button>
	        <button class="btn btn-primary cf-hotkey" v-on:click="cancelTitleChange()" accesskey="c">Cancel</button>
	      </div>
	    </div>
	  </div>

	  <div v-if="!editTitle" class="row">
	    <div class="col-mid-12 col-lg-12">
	      <div class="form-group" id="inputTitleFormGroup">
	        <span class="cf-log-title">{{title}}</span>
	        <button class="btn btn-default" v-on:click="clickEditTitle();">
	          <span class="glyphicon glyphicon-pencil" title="edit name"></span>
	        </button>
	        <button class="btn btn-default" v-on:click="clickConfigure();">
	          <span class="glyphicon glyphicon-cog" title="configure"></span>
	        </button>
	      </div>
	    </div>
	  </div>

	  <button v-if="log" class="btn btn-primary" v-on:click="addEntry();">Add Entry</button>

	  <table class="table table-hover">
	    <tbody v-for="entry in entryList">

	      <tr v-if="entry.edit">
	        <td colspan="2">

	        <entryedit v-bind:log="log" v-bind:entry="entry"></entryedit>

	        </td>
	      </tr>

	      <tr v-if="!entry.edit">
	        <td>
	          <div>{{entry.date | moment}}</div>
	        </td>
	        <td>
	          <span class="cf-row-buttons">
	            <button class="btn btn-primary" v-on:click="editEntry($index);">Edit</button>
	            <button class="btn btn-primary" v-on:click="deleteEntry($index);">Delete</button>
	          </span>
	        </td>
	      </tr>

	    </tbody>
	  </table>
	</div>
</template>

<script>
	import menu from "../menu/menu.vue";
	import entryedit from "./entryEdit.vue";

	Vue.filter("moment", function (value) {
		return moment(value).format("MM/DD/YYYY h:mm A");
	});

	export default {
		components: {
			menu: menu,
			entryedit: entryedit
		},
		data: function () {
			let m = location.pathname.match(/^\/log\/(.*)\/$/);
			if (!m) {
				throw new Error("invalid path " + location.pathname);
			}
			let title = decodeURI(m[1]);
			return {
				title: title,
				logList: [],
				log: null,
				err: "",
				editTitle: false,
				entryList: [],
				menuData: {
					isLog: true,
					logTitle: title
				}
			};
		},
		asyncData: function () {
			let self = this;
			return chronofeed.request("GET", "/api/log/", null).then(function (result) {
				let logList = result.list;
				let log;
				let err="";
				for (let l of logList) {
					if (l.title == self.title) {
						log = l;
						break;
					}
				}
				if (!log) {
					throw new Error("could not find log");
				}

				return chronofeed.request("GET", "/api/entry/" + log._id + "/").then(function (result) {
					let entryList = result.list;
					this.convertDates(entryList);
					return {
						log: log,
						logList: logList,
						entryList: result.list
					};
				}.bind(this));
			}.bind(this)).catch(function (err) {
				return {
					err: err.message ? err.message : err
				};
			});
		},
		created: function () {
			document.title = this.title + " | Chronofeed";
		},
		events: {
			error: function (err) {
				this.err = err;
			}
		},
		methods: {
			convertDates(entryList) {
				for (let entry of entryList) {
					if (entry.date) {
						entry.date = new Date(entry.date);
					}
				}
			},
			clickEditTitle() {
				this.editTitle = true;
			},
		  clickConfigure() {
		    location.assign("designer/");
		  },
		  saveTitleChange() {
		    if (this.title === "") {
		      $("#inputTitleFormGroup").addClass("has-error");
		      return;
		    }

		    let dupList = this.logList.filter(function (log) {
		    	return (log.title == this.title) && (log._id != this._id);
		    }.bind(this));
		    if (dupList.length) {
		      this.err = "A log with this title already exists";
		      return;
		    }

		    this.log.title = this.title;
	      for (let log of this.logList) {
	      	if (log._id == this.log._id) {
	      		log.title = this.title;
	      	}
	      }
	      document.title = this.title + " | Chronofeed";
	      chronofeed.setURL("/log/" + this.title + "/", this.title + " | ChronoFeed", true);
	      this.cancelTitleChange();
		    chronofeed.request("POST", "/api/log/" + this.log._id + "/", this.log).then(function () {
		    }).catch(function (err) {
		    	this.err = err.message;
		    });
		  },
		  cancelTitleChange() {
		  	this.err = "";
		    this.editTitle = false;
		  },
		  addEntry() {
		    let entry = {
		    	date: new Date(),
		    	edit: true
		    };

		    this.closeEntries();
		    this.entryList.push(entry);
		    Vue.nextTick(function () {
			    this.$broadcast("initDateTimePicker");
			  }.bind(this));
		  },
		  closeEntries() {
		  	for (let entry of this.entryList) {
		  		if (entry.edit) {
		  			entry.edit = false;
		  		}
		  	}
		  },
		  cleanupEntry(entry) {
		  	entry = Object.assign({}, entry);
		  	delete entry.edit;
		  	return entry;
		  },
		  editEntry(index) {
		  	let entry = this.entryList[index];
		  	Vue.set(entry, "edit", true);
		  	Vue.nextTick(function () {
			  	this.$broadcast("initDateTimePicker");
			  }.bind(this));
		  },
		  deleteEntry(index) {
		  	let entry = this.entryList[index];
		    this.entryList.splice(index,1);
		    chronofeed.request("DELETE", "/api/entry/" + this.log._id + "/" + entry._id + "/", null).catch(function (err) {
		    	this.err = err;
		    }.bind(this));
		  }
		}
	};
</script>