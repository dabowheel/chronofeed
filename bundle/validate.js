"use strict";

function fieldsAreValid(fieldList) {
  for (var id of fieldList) {
    let field = document.getElementById(id);
    if (field.value === "" && field.parentElement.style.display != "none") {
      return false;
    }
  }
  return true;
}


function setButton(fieldList, buttonID) {
  document.getElementById(buttonID).disabled = !fieldsAreValid(fieldList);
}

function makeEventHandler(fieldList,buttonID) {
  return function () {
    setButton(fieldList, buttonID);
  };
}

exports.requireFields = function (fieldList,buttonID) {
  setButton(fieldList, buttonID);
  var handler = makeEventHandler(fieldList, buttonID);
  for (var id of fieldList) {
    document.getElementById(id).oninput = handler;
  }
}

exports.triggerOnEnter = function (fieldList,callback) {
  function handler (e) {
    if (e.keyCode == 13) {
      callback();
    }
  }

  for (let id of fieldList) {
    document.getElementById(id).onkeypress = handler;
  }
};
