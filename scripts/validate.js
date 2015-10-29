function fieldsAreValid(fieldList) {
  for (var id of fieldList) {
    if (document.getElementById(id).value === "") {
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

function listenToFields(fieldList,buttonID) {
  setButton(fieldList, buttonID);
  var handler = makeEventHandler(fieldList, buttonID);
  for (var id of fieldList) {
    document.getElementById(id).oninput = handler;
  }
}

exports.addReturnPressListener = function (fieldList,callback) {
  function handler (e) {
    if (e.keyCode == 13) {
      callback();
    }
  }

  for (let id of fieldList) {
    document.getElementById(id).onkeypress = handler;
  }
};

exports.listenToFields = listenToFields;
