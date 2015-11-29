"use strict";
let Component = require("./component");
let template = require("./timeLogTable.hbs");
let timelog = require("./timelog");

class TimeLogTable extends Component {
	constructor(containerID) {
		super(containerID);
		this.global();
	}
	render(callback) {
		callback(null, template(this.getTable()));
	}
	getTable() {
		let ret = {
			events: []
		};
		let startTime;
		let lastTime;
		let lastEvent;
		let lastRow;
		for (let e of timelog.getLog()) {
			if (!startTime) {
				startTime = e.time;
			}
			let row = {
				name: e.name,
				time: ((e.time-startTime)/1000.0).toFixed(3)
			};
			if (lastEvent) {
				lastRow.duration = ((e.time - lastEvent.time)/1000.0).toFixed(3);
			}

			ret.events.push(row);
			lastEvent = e;
			lastRow = row;
		}
		return ret;
	}
}

module.exports = TimeLogTable;
