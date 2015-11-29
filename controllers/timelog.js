"use strict";
function init() {
	global.component.TimeLog = [];
	addEvent("init");
}

function addEvent(name) {
	global.component.TimeLog.push({
		time: new Date().getTime(),
		name: name
	});
}

function getLog() {
	return global.component.TimeLog;
}

exports.init = init;
exports.addEvent = addEvent;
exports.getLog = getLog;
