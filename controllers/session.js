
function setUsername(username) {
	component.All.username = username;
	component.All.hasInfo = true;
}

function getUsername() {
	return component.All.username;
}

function hasInfo() {
	return component.All.hasInfo;
}

module.exports.setUsername = setUsername;
module.exports.getUsername = getUsername;
module.exports.hasInfo = hasInfo;
