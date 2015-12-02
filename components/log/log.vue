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
	  <div v-if="err" class="col-md-6 col-lg-6 alert alert-warning" id="placeForAlert">{{err}}</div>

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
	          <div><strong>Edit</strong></div>
	          <div><input class="form-control" id="posttitle" type="text" v-model="entry.title"/></div>
	          <div><textarea class="form-control" id="posttext" rows="5" v-model="entry.text"></textarea></div>

	          <div class="container">
	            <div class="row">
	                <div class="form-group">
	                  <div class='input-group date cf-input-group' id='datetimepicker'>
	                    <input type='text' class="form-control cf-form-group" />
	                    <span class="input-group-addon cf-input-group-addon">
	                      <span class="glyphicon glyphicon-calendar"></span>
	                    </span>
	                  </div>
	                </div>
	              </div>
	            </div>
	          </div>

	          <div class="cf-row-buttons">
	            <button class="btn btn-primary cf-hotkey" v-on:click="savePostChanges($index);" accesskey="a">Accept</button>
	            <button class="btn btn-primary cf-hotkey" v-on:click="cancelPostChanges($index);" accesskey="c">Cancel</button>
	          </div>
	        </td>
	      </tr>

	      <tr v-if="!entry.edit">
	        <td>
	          <div><strong>{{entry.title}}</strong></div>
	          <div>{{{entry.text}}}</div>
	          <div>{{moment(entry.date).format()}}</div>
	        </td>
	        <td>
	          <span class="cf-row-buttons">
	            <button class="btn btn-primary" v-on:click="editPost($index);">Edit</button>
	            <button class="btn btn-primary" v-on:click="deletePost($index);">Delete</button>
	          </span>
	        </td>
	      </tr>

	    </tbody>
	  </table>
	</div>
</template>

<script>
	export default {
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
				entryList: []
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

				return {
					log: log,
					logList: logList,
					err: err
				};
			}).catch(function (err) {
				return {
					err: err.message ? err.message : err
				};
			});
		},
		created: function () {
			document.title = this.title + " | Chronofeed";
		},
		methods: {
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
		    this.entryList.push(entry);
		  },
		  saveEntryChanges(index) {
		  	let entry = this.entryList[index];
		  	entry.edit = false;
		    if (entry._id) {
		      chronofeed.request("POST", "/api/entry/" + entry._id + "/", entry).then(function () {
		      }).catch(function (err) {
		      	this.err = err.message;
		      });
		    } else {
		      chronofeed.request("PUT", "/api/entry/", entry).then(function (newEntry) {
		      	entry._id = newEntry._id;
		      }).catch(function (err) {
		      	this.err = err.message;
		      });
		    }
		  },
		  cancelEntryChanges(index) {
		  	this.entryList[index].edit = false;
		  },
		  deleteEntry(index) {
		  	let entry = entryList[index];
		    this.entryList.splice(index,1);
		    chronofeed.request("DELETE", "/api/entry/" + entry._id + "/", null).catch(function (err) {
		    	this.err = err.message;
		    });
		  }
		}
	};
</script>