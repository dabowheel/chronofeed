function getInputDateValue(d) {
  return d.getFullYear() + "-" + ((d.getMonth()+1)<10?"0":"") + (d.getMonth()+1) + "-" + (d.getDate()<10?"0":"") + d.getDate();
}
function getInputTimeValue(d) {
  return ((d.getHours()<10)?"0":"") + d.getHours() + ":" + ((d.getMinutes()<10)?"0":"") + d.getMinutes();
}
function toDateString(d) {
  if (global.navigator) {
    return d.toLocaleDateString() + " " + d.toLocaleTimeString(global.navigator.language,{hour:"2-digit",minute:"2-digit"});
  } else {
    return d.toString();
  }
}
function toDBDateString(d) {
  return getInputDateValue(d) + " " + getInputTimeValue(d);
}

exports.getInputDateValue = getInputDateValue;
exports.getInputTimeValue = getInputTimeValue;
exports.toDateString = toDateString;
exports.toDBDateString = toDBDateString;
